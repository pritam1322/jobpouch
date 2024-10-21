import { getServerSession } from "next-auth";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import authOptions from "@/app/api/auth/[...nextauth]/route";

export default async function ProfileForm() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <section className="p-6 flex justify-center items-center h-screen bg-black">
      <form className="flex flex-col gap-6 max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="rounded-full overflow-hidden border-2 border-gray-500 shadow-md w-32 h-32">
            <Image
              src={session.user?.image || "/image.jpg"}
              width={128}
              height={128}
              alt="avatar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-white block text-sm font-medium mb-2" htmlFor="nameIn">
            Display Name
          </label>
          <input
            type="text"
            id="nameIn"
            name="displayName"
            defaultValue={session.user?.name || ""}
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-white block text-sm font-medium mb-2" htmlFor="locationIn">
            Location
          </label>
          <input
            type="text"
            id="locationIn"
            name="location"
            placeholder="Somewhere in the world"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-white block text-sm font-medium mb-2" htmlFor="bioIn">
            Bio
          </label>
          <textarea
            name="bio"
            id="bioIn"
            placeholder="Your bio goes here..."
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 w-full rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </button>
        </div>
      </form>
    </section>
  );
}
