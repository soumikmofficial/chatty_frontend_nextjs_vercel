import { Formik, Form, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { FormikControl } from "..";
import { useAppContext } from "../../context/appContext";
import { useLoginMutation } from "../../hooks/authHooks";

interface IFormData {
  email: string;
  password: string;
}

const FormikContainer: React.FC = () => {
  const { setUser, user } = useAppContext();
  const router = useRouter();

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().required("email required"),
    password: Yup.string().required("password required"),
  });

  // todo: use query
  const {
    mutateAsync: login,
    isLoading: loggingIn,
    isSuccess,
  } = useLoginMutation();

  // todo: functions
  const handleSubmit = async (
    values: IFormData,
    submitProps: FormikHelpers<IFormData>
  ) => {
    await login(values);
  };

  useEffect(() => {
    if (user && isSuccess) {
      router.push("/chat");
    }
  }, [user, isSuccess]);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, submitProps) => handleSubmit(values, submitProps)}
    >
      {(formik) => (
        <Form>
          <FormikControl
            name="email"
            type="email"
            control="input"
            label="email"
            placeholder="email"
          />
          <FormikControl
            name="password"
            type="password"
            control="input"
            label="password"
            placeholder="password"
          />
          <button
            type="submit"
            className={` w-full
                        rounded-md
                        border
                        bordder-primary
                        py-2
                        px-3
                        text-white
                        text-base
                        cursor-pointer
                        hover:bg-opacity-90
                        transition
                        mb-3 ${
                          formik.isSubmitting || !formik.isValid || loggingIn
                            ? "bg-gray-500"
                            : " bg-highlight"
                        }`}
            disabled={formik.isSubmitting || !formik.isValid || loggingIn}
          >
            {loggingIn ? "loading..." : "log in"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormikContainer;
