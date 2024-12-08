  'use client';
  import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
  import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { loadStripe } from '@stripe/stripe-js';
  import { useSession } from "next-auth/react";
  import { useRouter } from "next/navigation";
  import toast from "react-hot-toast";
  import { useState } from 'react';
  import { trpc } from "@/trpc-client/client";
import { prisma } from "@/trpc-server/prisma";

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  export default function PricingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    //const [email, setEmail] = useState('');
    if(!session?.user?.email){
      router.push('/login')
    }
    const email = session?.user?.email;

    const { data: user } = trpc.getUserByEmail.useQuery(
      { email: session?.user?.email as string }, 
      { enabled: !!session?.user?.email }
    );
    

    if(user?.stripeSubscriptionId){
      toast.success('Already subscribed');
      router.push('/')
    }

    const handlePaymentSetup = async (ev: React.FormEvent) => {
      ev.preventDefault();
      if (email !== session?.user?.email) {
        toast.error("Please enter your email address to setup payment.");
        return;
      }

      try {
        const response = await fetch('/api/create-stripe-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });

        if (response.status === 201) {
          toast.success(`Payment setup created for ${user?.name}`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to set up payment: " + (error instanceof Error ? error.message : error));
      }
    };

    const handleCheckout = async (plan: 'essential' | 'premium') => {
      
      console.log('Stripe Publishable Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;
      
      console.log('POST 123');
      let priceId: string | null | undefined;
      if (plan == 'essential') {
        priceId = process.env.NEXT_PUBLIC_BASIC_PRICE_ID;
      } else {
        priceId = process.env.NEXT_PUBLIC_PREMIUM_PRICE_ID;
      }
      const body = JSON.stringify({ userId: session?.user?.id, priceId });
      console.log(body);
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
      console.log(response);
      const { sessionId } = await response.json();

      if (sessionId) {
        stripe?.redirectToCheckout({ sessionId });
        toast.success('Navigating to checkout')
      }
    };

    return (
      <section className="my-24">
        <div className="text-center items-center justify-center flex flex-row">
          <div className="text-6xl">Plans That Fit Your Needs</div>
          <label className="swap swap-flip text-3xl -rotate-12">
            <input type="checkbox" />
            <div className="swap-on">😈</div>
            <div className="swap-off">😇</div>
          </label>
        </div>

        {!user?.stripeCustomerId && (
            <div className="flex flex-col mx-auto max-w-lg justify-center my-6">
            <span className="text-center">Complete your payment setup</span>
            <form onSubmit={handlePaymentSetup} className="flex flex-col">
              <input
                type="text"
                className="p-2 my-1"
                placeholder="Enter your email id"
                name="email"
                id="email"
                required
                //onChange={(ev) => setEmail(ev.target.value)}
              />
              <button className="btn btn-error mt-2 text-white">
                Payment setup
              </button>
            </form>
          </div>
        )}
          


        <div className="max-w-5xl mx-auto my-12 hero-content">
          <div className="flex border border-gray-300 rounded-box max-w-sm p-4 bg-black">
            <div className="flex flex-col">
              <span>Essential plan</span>
              <span className="text-3xl">
                <FontAwesomeIcon icon={faSackDollar} className="h-6" /> 5{' '}
                <span className="text-sm text-gray-400">/ month</span>
              </span>
              <ul className="menu bg-base-200 rounded-btn w-70 mt-4">
                <li className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="h-5" />
                  <a>Can apply up to 15 jobs</a>
                </li>
                <li className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="h-5" />
                  <a>Analysis available for 15 jobs</a>
                </li>
                <li className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="h-5" />
                  <a>Free resume storage up to 2 resumes</a>
                </li>
              </ul>
              <button onClick={() => handleCheckout('essential')} className="btn btn-secondary mt-3 py-1">
                Get Essential
              </button>
            </div>
          </div>
          <div className="flex border border-gray-300 rounded-box max-w-sm p-4 bg-black">
            <div className="flex flex-col">
              <span>Premium plan</span>
              <span className="text-3xl">
                <FontAwesomeIcon icon={faSackDollar} className="h-6" /> 15{' '}
                <span className="text-sm text-gray-400">/ month</span>
              </span>
              <ul className="menu bg-base-200 rounded-btn w-70 mt-4">
                <li className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="h-5" />
                  <a>Can apply up to 30 jobs</a>
                </li>
                <li className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="h-5" />
                  <a>Analysis available for 30 jobs</a>
                </li>
                <li className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="h-5" />
                  <a>Free resume storage up to 5 resumes</a>
                </li>
              </ul>
              <button onClick={() => handleCheckout('premium')} className="btn btn-accent mt-3 py-1">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
