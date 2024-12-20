import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/trpc-server/prisma';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';



export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await request.text();
  const sig = headers().get('stripe-signature');
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
    //console.log(`�� Event received: ${JSON.stringify(event)}`);
    //return NextResponse.json({ error: `Webhook Error: ${JSON.stringify(event)}` }, { status: 300 });
  } catch (err) {
    console.error(`❌ Error verifying webhook signature: ${err}`);
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
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
