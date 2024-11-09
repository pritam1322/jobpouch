import { FieldValues, Path, UseFormRegister } from "react-hook-form";



type InputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
}

const Input = <T extends FieldValues> ({ label, name,  register, required }: InputProps<T>) => (
  <div>
    <label htmlFor={name} className="block font-medium text-white">
      {label}
    </label>
    <input 
      id={name}
      {...register(name, { required })}
      className={`mt-1 w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
      placeholder="Enter your email"
    />
  </div>
);

export default Input;
