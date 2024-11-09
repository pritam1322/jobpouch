'use client';
import Input from "@/components/ui/FormInputs";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";

interface IFormValues {
    password: string;
    confirmPassword: string;
}

export type PageProps = {
  params: {
    token: string;
  };
};

export default function ResetPassowrd({params: {token}, } : PageProps){

    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>();
    const router = useRouter()

    const onSubmit = async(data: IFormValues) => {
        // Reset password logic goes here
        try {
          if(data.password !== data.confirmPassword){
            toast.error("Both password and confirmPassword should be the same");
          }
          if (data.password) {
            const res = await fetch('/api/reset-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: token, password: data.password}),
            });
            if (res.ok) {
              toast.success("Reset password email has been sent");
              router.push("/login");
            } else {
              toast.error("Failed to send reset password email");
            }
          } else {
            toast.error("Email not found");
          }
        } catch (error) {
          toast.error("An error occurred - " + error);
        }
        
      };

    return(
        <section className="min-h-screen flex items-center justify-center bg-gray-200 ">
      <div className="flex flex-col rounded-lg shadow-lg bg-black p-8 max-w-md w-full">
        <div className="flex gap-4 mb-8 text-xl font-semibold text-center">
            <FontAwesomeIcon icon={faUnlockKeyhole} className="h-6" />
          <h1>Forgot Password</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className=" p-4 rounded-md">
          <div className="mb-4 w-full ">
            <Input 
              label="Password" 
              register={register} 
              name = "password"
              required
            />
            <ErrorMessage errors={errors} name="password" />
          </div>
          <div className="mb-4 w-full ">
            <Input 
              label="ConfirmPassword" 
              register={register} 
              name = "confirmPassword"
              required
            />
            <ErrorMessage errors={errors} name="confirmPassword" />
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Save Password
          </button>
        </form>
      </div>
    </section>
    )
}