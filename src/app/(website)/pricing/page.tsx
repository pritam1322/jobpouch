  'use client';
  import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
  import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useSession } from "next-auth/react";
  import { useRouter } from "next/navigation";
  import toast from "react-hot-toast";
  import { trpc } from "@/trpc-client/client";
  import Script from "next/script";
  import { prisma } from "@/trpc-server/prisma";

  interface RazorpayResponse {
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
  }

  interface RazorpayOptions {
    key: string | undefined;
    subscription_id: string;
    customer_id: string;
    amount: string;
    currency: string;
    name: string;
    description: string;
    image: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
      name: string;
      email: string;
    };
    notes: {
      address: string;
    };
    theme: {
      color: string;
    };
  }

  declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => { open: () => void; };
    }
  }

  export default function PricingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    if(!session?.user?.email){
      router.push('/login')
    }

    const { data: user } = trpc.getUserByEmail.useQuery(
      { email: session?.user?.email as string }, 
      { enabled: !!session?.user?.email }
    );
    

    if (status === "unauthenticated") {
      router.push("/");
    }

    const candidateId = session?.user?.id ? parseInt(session.user.id as string) : null;

    const handleCheckout = async (plan: 'essential' | 'premium') => {
      
      console.log('Stripe Publishable Key:', process.env.NEXT_PUBLIC_RAZORPAY_CLIENT_ID);
      // const stripe = await stripePromise;
      toast.success('Subscription process Initiated')
      console.log('POST 123');
      let planId: string | null | undefined;
      if (plan == 'essential') {
        planId = process.env.NEXT_PUBLIC_BASIC_PRICE_ID;
      } else {
        planId = process.env.NEXT_PUBLIC_PREMIUM_PRICE_ID;
      }
      const body = JSON.stringify({ userId: Number(candidateId), planId });
      console.log(body);
      const response = await fetch('/api/create-subscription-razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
      console.log(response);
      const { subscriptionId, customerId } = await response.json();
      console.log(subscriptionId);
      
      if (subscriptionId) {
        // stripe?.redirectToCheckout({ sessionId });
        const amount = plan === 'essential' ? 171 : 428; // Amount in paise (₹50 or ₹150)
    
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_CLIENT_ID, // Razorpay key
          subscription_id: subscriptionId,
          customer_id: customerId,
          amount: amount.toString(),
          currency: "INR",
          name: "JobPouch",
          description: `${plan} Plan Subscription`,
          image: "https://example.com/logo.png",
          handler: function (response: RazorpayResponse) {
            console.log("Payment Success:", response);
            prisma.subscriptionDetails.update({
              where: { razorpaySubscriptionId: subscriptionId},
              data: {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              }
            })
            toast.success("Payment Successful");
            router.push('/success'); // Navigate to the desired route
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || ''
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
          //callback_url : `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      }
      const razorpay = new window.Razorpay(options); // Initialize Razorpay
      razorpay.open(); 
    };
  }

    const handleCancelSubscription = async() => {
      try {
        const response = await fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });
        if(response.ok){
          toast.success("Subscription cancelled");
          router.push('/');
        }
      }catch (error){
        toast.error("Failed to cancel subscription: " + error);
      }
    }
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

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
        />

        {!user?.razorpaySubscriptionId && (
        <div className="max-w-5xl mx-auto my-12 hero-content">
          <div className="flex border border-gray-300 rounded-box max-w-sm p-4 bg-black">
            <div className="flex flex-col">
              <span>Essential plan</span>
              <span className="text-3xl">
                <FontAwesomeIcon icon={faSackDollar} className="h-6" /> 2{' '}
                <span className="text-sm text-gray-400">dollar / month</span>
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
                  <a>AI Creds - 5</a>
                </li>
              </ul>
              <button id="razorpay-checkout-js" onClick={() => handleCheckout('essential')} className="btn btn-secondary mt-3 py-1">
                Get Essential
              </button>
            </div>
          </div>
          <div className="flex border border-gray-300 rounded-box max-w-sm p-4 bg-black">
            <div className="flex flex-col">
              <span>Premium plan</span>
              <span className="text-3xl">
                <FontAwesomeIcon icon={faSackDollar} className="h-6" /> 5{' '}
                <span className="text-sm text-gray-400">dollars / month</span>
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
                  <a>AI Creds - 10</a>
                </li>
              </ul>
              <button id="razorpay-checkout-js" onClick={() => handleCheckout('premium')} className="btn btn-accent mt-3 py-1">
                Get Premium
              </button>
            </div>
          </div>
        </div>)}


        {user?.razorpaySubscriptionId && (
          <section className="max-w-5xl mx-auto my-12 hero-content">
            <div className="flex flex-col w-full">
              <span className="text-center">Complete your payment setup</span>
              <button onClick={handleCancelSubscription} className="btn btn-error my-4 w-1/2 mx-auto text-white">
                Payment setup
              </button>
            </div>
          </section>
        )}
      </section>
    );
  }
