import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex lg:flex-col  gap-16 lg:gap-16 items-center justify-between px-8 py-16 lg:py-16">

      {/* <Title /> */}

      <div className=" max-w-6xl text-center">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          Find, Track and Land Your Dream Job
        </h1>
        <p className="text-lg lg:text-xl text-gray-200 mb-10">
          Stay ahead in your job search with real-time tracking and personalized application management.
        </p>
        <Link href={'/viewJobApplication'} className="w-full lg:w-auto px-28 py-3 mt-8 bg-orange-700 text-white font-semibold text-lg rounded-md shadow-lg hover:bg-orange-800 transition duration-300 ease-in-out text-center">
          Get Started
        </Link>
      </div>
    </section>
  );
}
