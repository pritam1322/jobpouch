import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse lg:flex-row gap-16 lg:gap-16 items-center justify-between px-8 py-16 lg:py-16">
      {/* Text Section */}
      <div className=" max-w-xl">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          Find, Track<br /> and Land Your Dream Job
        </h1>
        <p className="text-lg lg:text-xl text-gray-200 mb-6">
          Stay ahead in your job search with real-time tracking and personalized application management.
        </p>
        <Link href={'/createJobApplication'} className="px-6 py-3 mt-4 bg-white text-indigo-700 font-semibold text-lg rounded-full shadow-lg hover:bg-indigo-100 transition duration-300 ease-in-out">
          Get Started
        </Link>
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0">
        <Image
          src="/image.jpg"
          alt="Find your dream job"
          width={450}
          height={450}
          className="rounded-lg border-4 border-white shadow-xl"
        />
      </div>
    </section>
  );
}
