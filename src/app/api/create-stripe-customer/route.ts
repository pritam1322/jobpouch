import stripe from "@/lib/stripe";
import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const body = await request.json();
    const { userId } = body;

    try{
        const user = await prisma.user.findUnique({where: {id: userId}});
        if(!user){
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        if(user?.stripeCustomerId){
            return NextResponse.json({error: 'Payment setup is already done for current user'}, {status: 404});
        }

        
        
        if(!user.stripeCustomerId){
            const customer = await stripe.customers.create({
                email:  user.email
            });

            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: customer.id }
            });

            return NextResponse.json({message: 'Customer created successfully', customerId: customer.id}, { status: 201 });
        }
    }catch(error){
        return NextResponse.json({message: 'Internal server error', error }, {status: 500});
    }
}