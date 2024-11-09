'use client';
import Input from "@/components/ui/FormInputs";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IFormValues {
    email: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>();


  const onSubmit = async(data: IFormValues) => {
    try {
      if (data.email) {
        const res = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email }),
        });
        if (res.ok) {
          toast.success("Reset password email has been sent");
        } else {
          toast.error("Failed to send reset password email");
        }
      } else {
        toast.error("Email not found");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="flex flex-col rounded-lg shadow-lg bg-black p-8 max-w-md w-full">
        <div className="flex gap-4 mb-8 text-xl font-semibold text-center">
          <FontAwesomeIcon icon={faUnlockKeyhole} className="h-6" />
          <h1>Forgot Password</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded-md">
          <div className="mb-4 w-full">
            <Input 
              label="Email" 
              register={register} 
              name="email"
              required
            />
            <ErrorMessage errors={errors} name="email" />
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Send me a reset password email
          </button>
        </form>
      </div>
    </section>
  );
}
