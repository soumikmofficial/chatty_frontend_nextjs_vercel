import { AlertPrompt, FormikControl } from "../components";
import { Formik, Form, FormikHelpers } from "formik";

import * as Yup from "yup";
import { useForgotMutation, useResetMutation } from "../hooks/authHooks";
import { useAppContext } from "../context/appContext";

interface IFormData {
  email: string;
}

const ForgotPassword = () => {
  // todo: context
  const { alert } = useAppContext();

  const initialValues = { email: "" };
  const validationSchema = Yup.object({
    email: Yup.string().required("email required"),
  });

  // todo: functions
  const handleSubmit = async (
    values: IFormData,
    submitProps: FormikHelpers<IFormData>
  ) => {
    await reset({ email: values.email });
    if (data && data.status === "success") {
      submitProps.resetForm();
    }
  };

  //   todo: query and mutation
  const { mutateAsync: reset, isLoading, data } = useForgotMutation();

  return (
    <div className="bg-primary flex items-center justify-center h-screen w-full">
      {alert && <AlertPrompt message={alert} />}
      <section className="w-full max-w-[400px] min-w-[330px] mt-5">
        <div
          className="
          shadow-form
               max-w-[525px]
               mx-auto
               text-center
               bg-secondary
               rounded-lg
               relative
               overflow-hidden
               py-5
               px-4
               sm:px-12
               md:px-[60px]
               w-4/5
               "
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, submitProps) =>
              handleSubmit(values, submitProps)
            }
          >
            {(formik) => (
              <Form>
                <h2 className="mb-8">Reset Password</h2>
                <FormikControl
                  name="email"
                  type="email"
                  control="input"
                  label="email"
                  placeholder="email"
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
                          formik.isSubmitting || !formik.isValid || isLoading
                            ? "bg-gray-500"
                            : " bg-highlight"
                        }`}
                  disabled={formik.isSubmitting || !formik.isValid || isLoading}
                >
                  {isLoading ? "loading..." : "Reset"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
