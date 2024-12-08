import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/trpc-server/prisma';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';

export const config = {
  api: {
    bodyParser: false, // Ensure body parsing is disabled for Stripe webhooks
  },
};


async function buffer(request: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error('Request body is not readable');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value!);
  }

  return Buffer.concat(chunks);
}

type METADATA = {
  userId: string;
  priceId: string;
};


export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await buffer(request);
  const sig = headers().get('stripe-signature');
  //console.log(rawBody.toString());
  //console.log(sig);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
    //console.log(`�� Event received: ${JSON.stringify(event)}`);
    //return NextResponse.json({ error: `Webhook Error: ${JSON.stringify(event)}` }, { status: 300 });
  } catch (err: any) {
    console.error(`❌ Error verifying webhook signature: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    const subscription = event.data.object as Stripe.Subscription;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionCreateOrUpdate(subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDelete(subscription);
        break;

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(`❌ Error handling event: ${err}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleSubscriptionCreateOrUpdate(subscription: Stripe.Subscription) {
  if(!subscription.customer){
    return NextResponse.json({ error: 'No Subscription customer' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: subscription.customer as string },
  });
  
  if (!user) {
    console.warn('No user found for Stripe customer:', subscription.customer);
    return;
  }

  await prisma.subscriptionDetails.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  const subscriptions = await stripe.subscriptions.retrieve(subscription.id, {
    expand: ["default_payment_method"],
  });

  const item = subscriptions.items.data[0];
  const priceId = item.price.id;
  const plan: string = priceId === process.env.NEXT_PUBLIC_BASIC_PRICE_ID ? 'Essential' : 'Premium';

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPlan: plan
    },
  });
}

async function handleSubscriptionDelete(subscription: Stripe.Subscription) {
  await prisma.subscriptionDetails.delete({
    where: { stripeSubscriptionId: subscription.id },
  });
}
