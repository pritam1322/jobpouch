import stripe from "@/lib/stripe";
import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const body = await request.json();
    const { userId, priceId } = body;

    try{
        const user = await prisma.user.findUnique({where: {id: Number(userId)}});
        if(!user){
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }
        if(!user?.stripeCustomerId){
            return NextResponse.json({error: 'No payment setup for logged in user found'}, {status: 301});
        }
        if(user.stripeSubscriptionId){
            return NextResponse.json({error: 'Subcription already in progress'}, {status: 301});
        }
        const session = await stripe.checkout.sessions.create({
          customer: user.stripeCustomerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId, // Stripe Price ID
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        });
        
        return NextResponse.json({message: 'Subscription successfull',  sessionId: session.id }, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({message: 'Internal server error', error }, {status: 500});
    }
}