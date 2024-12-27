
import instance from "@/lib/razorpay";
import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const body = await request.json();
    const { userId, planId } = body;

    try{
        const user = await prisma.user.findUnique({where: {id: Number(userId)}});
        if(!user){
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }
        // if(!user?.razorpayCustomerId){
        //     return NextResponse.json({error: 'No payment setup for logged in user found'}, {status: 301});
        // }
        if(user?.razorpayCustomerId){
            return NextResponse.json({error: 'Payment setup is already done for current user'}, {status: 404});
        }
        if(user.razorpaySubscriptionId){
            return NextResponse.json({error: 'Subcription already in progress'}, {status: 301});
        }
        const subscription = await instance.subscriptions.create({
          plan_id: planId,
          customer_notify: 1,
          total_count: 1,
          quantity: 1
        });
        console.log(subscription);
        console.log(subscription.customer_id);
        const plan: string = subscription.plan_id === process.env.NEXT_PUBLIC_BASIC_PRICE_ID ? 'Essential' : 'Premium';

        await prisma.user.update({
            where: { id: userId },
            data: { 
                razorpayCustomerId: subscription.customer_id,
                razorpaySubscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                subscriptionPlan: plan
            }
        });

        await prisma.subscriptionDetails.upsert({
            where: { razorpaySubscriptionId: subscription.id },
            update: {
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_start! * 1000),
              currentPeriodEnd: new Date(subscription.current_end! * 1000),
            },
            create: {
              userId: user.id,
              razorpaySubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_start! * 1000),
              currentPeriodEnd: new Date(subscription.current_end! * 1000),
            },
          });

        return NextResponse.json({message: 'Subscription successfull',  subscriptionId: subscription.id, customerId: subscription.customer_id }, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({message: 'Internal server error', error }, {status: 500});
    }
}


