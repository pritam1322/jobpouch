import { NextResponse } from 'next/server';
import { prisma } from '@/trpc-server/prisma';
import { headers } from 'next/headers';
import crypto from 'crypto';

interface RazorpaySubscription {
  id: string;
  customer_id: string;
  plan_id: string;
  status: string;
  start_at: number;
  end_at: number;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const rawBody = await request.text();
  const signature = headers().get('x-razorpay-signature');

  try {
    // Verify Razorpay webhook signature
    const isValidSignature = verifyRazorpaySignature(rawBody, signature!, webhookSecret);

    if (!isValidSignature) {
      console.error('❌ Invalid Razorpay webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    switch (event.event) {
      case 'subscription.completed':
      case 'subscription.updated':
        await handleSubscriptionCreateOrUpdate(event.payload.subscription);
        break;

    //   case 'subscription.cancelled':
    //     await handleSubscriptionDelete(event.payload.subscription);
    //     break;

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(`❌ Error handling event: ${err}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function verifyRazorpaySignature(payload: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return hash === signature;
}

async function handleSubscriptionCreateOrUpdate(subscription: RazorpaySubscription) {
  const razorpayCustomerId = subscription.customer_id;
  const user = await prisma.user.findUnique({
    where: { razorpayCustomerId },
  });

  if (!user) {
    console.warn('No user found for Razorpay customer:', razorpayCustomerId);
    return;
  }

  await prisma.subscriptionDetails.upsert({
    where: { razorpaySubscriptionId: subscription.id },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.start_at * 1000),
      currentPeriodEnd: new Date(subscription.end_at * 1000),
    },
    create: {
      userId: user.id,
      razorpaySubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.start_at * 1000),
      currentPeriodEnd: new Date(subscription.end_at * 1000),
    },
  });

  const plan = subscription.plan_id === process.env.RAZORPAY_BASIC_PLAN_ID ? 'Essential' : 'Premium';

  await prisma.user.update({
    where: { id: user.id },
    data: {
      razorpayCustomerId: subscription.customer_id,
      razorpaySubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPlan: plan,
    },
  });
}

// async function handleSubscriptionDelete(subscription: any) {
//   await prisma.subscriptionDetails.delete({
//     where: { razorpaySubscriptionId: subscription.id },
//   });
// }
