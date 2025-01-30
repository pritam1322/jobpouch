
import instance from "@/lib/razorpay";
import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const body = await request.json();
    const { userId } = body;

    try{
        const user = await prisma.user.findUnique({where: {id: Number(userId)}});
        if(!user){
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }
        // if(!user?.razorpayCustomerId){
        //     return NextResponse.json({error: 'No payment setup for logged in user found'}, {status: 301});
        // }
        // if(!user?.razorpayCustomerId){
        //     return NextResponse.json({error: 'Payment setup is already done for current user'}, {status: 404});
        // }
        if(!user.razorpaySubscriptionId){
            return NextResponse.json({error: 'Subcription already in progress'}, {status: 301});
        }
        await instance.subscriptions.cancel(user.razorpaySubscriptionId);

        // const plan: string = subscription.plan_id === process.env.NEXT_PUBLIC_BASIC_PRICE_ID ? 'Essential' : 'Premium';

        await prisma.user.update({
            where: { id: userId },
            data: { 
                razorpayCustomerId: null,
                razorpaySubscriptionId: null,
                subscriptionStatus: 'cancelled',
                subscriptionPlan: null
            }
        });

        await prisma.subscriptionDetails.delete({
            where: { razorpaySubscriptionId: user.razorpaySubscriptionId }
        });


        return NextResponse.json({message: 'Subscription cancelled successfull' }, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({message: 'Internal server error', error }, {status: 500});
    }
}


