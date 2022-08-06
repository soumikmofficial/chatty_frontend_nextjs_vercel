import { Formik, Form, FormikHelpers } from "formik";
import React, { RefObject, useRef } from "react";
import * as Yup from "yup";
import { FormikControl, Spinner } from "..";
import { useRegisterMutation } from "../../hooks/authHooks";

interface IFormData {
  email: string;
  password1: string;
  password2: string;
  avatar: string | File;
  name: string;
}

const RegisterFormikContainer: React.FC = () => {
  // todo: states and refs
  const avatarRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  // todo: formik values and schema
  const initialValues: IFormData = {
    name: "",
    email: "",
    password1: "",
    password2: "",
    avatar: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("name is required"),
    email: Yup.string().required("email is required"),
    password1: Yup.string().required("field is required"),
    password2: Yup.string().oneOf(
      [Yup.ref("password1"), null],
      "Passwords must match"
    ),
    avatar: Yup.mixed()
      .test("fileSize", "The file is too large", (value) => {
        if (!value) return true; // attachment is optional
        return value.size <= 5000000;
      })
      .test(
        "fileFormat",
        "Unsupported Format",
        (value) =>
          value &&
          [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/svg",
            "image/gif",
          ].includes(value.type)
      ),
  });

  // todo: react-query
  const {
    mutateAsync: register,
    isLoading: registering,
    isError,
  } = useRegisterMutation();

  // todo: functions
  const handleSubmit = async (
    values: IFormData,
    submitProps: FormikHelpers<IFormData>
  ) => {
    if (values.password1 !== values.password2) return;
    const regData = {
      name: values.name,
      password: values.password1,
      avatar: values.avatar,
      email: values.email,
    };
    await register(regData);
    if (!isError) {
      avatarRef.current.value = "";
      submitProps.resetForm();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, submitProps) => handleSubmit(values, submitProps)}
    >
      {(formik) => (
        <Form>
          <FormikControl
            name="name"
            type="text"
            control="input"
            label="name"
            placeholder="name"
          />
          <FormikControl
            name="email"
            type="email"
            control="input"
            label="email"
            placeholder="email"
          />
          <FormikControl
            name="password1"
            type="password"
            control="input"
            label="password1"
            placeholder="password"
          />
          <FormikControl
            name="password2"
            type="password"
            control="input"
            label="password2"
            placeholder="retype password"
          />
          <input
            ref={avatarRef}
            onChange={(e: any) =>
              formik.setFieldValue("avatar", e.target.files[0])
            }
            accept="image/png, image/jpg, image/jpeg, image/svg, image/gif"
            type="file"
            id="avatar"
            name="avatar"
            className="w-full                        
                        
                        text-base text-body-color
                        outline-none
                      
                         "
          />
          <button
            type="submit"
            className={` w-full
            mt-4 rounded-md py-2 px-3
                        text-white
                        text-base
                        cursor-pointer
                        hover:bg-opacity-90
                        transition
                        capitalize
                        mb-3 ${
                          formik.isSubmitting || !formik.isValid || registering
                            ? "bg-gray-500"
                            : " bg-highlight"
                        }`}
            disabled={formik.isSubmitting || !formik.isValid || registering}
          >
            {registering ? "loading..." : "sign up"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterFormikContainer;
