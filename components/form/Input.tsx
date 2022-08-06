import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormError } from "..";

interface IInputProps {
  placeholder: string;
  name: string;
  type: string;
  [x: string]: string;
}

const Input: React.FC<IInputProps> = (props) => {
  const { placeholder, name, type, ...rest } = props;
  return (
    <div className="form-control mb-6">
      {/* <label htmlFor={name}>{label}</label> */}
      <Field
        name={name}
        id={name}
        placeholder={placeholder}
        type={type}
        {...rest}
        className="w-full
        placeholder:capitalize
                        py-2
                        px-3
                        bg-black
                        text-base text-body-color
                        placeholder-[#ACB6BE]
                        outline-none
                        rounded-md
                        
                         "
      />
      <ErrorMessage name={name} component={FormError} />
    </div>
  );
};

export default Input;
