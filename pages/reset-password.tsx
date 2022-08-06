import { useRouter } from "next/router";
import { AlertPrompt, FormikControl } from "../components";
import { useAppContext } from "../context/appContext";
import { useResetMutation } from "../hooks/authHooks";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

interface IFormData {
  password1: string;
  password2: string;
}

//  todo: the component
const ResetPassword: React.FC = () => {
  const router = useRouter();
  const { setAlert, user } = useAppContext();
  const email = router.query.email as string;
  const token = router.query.token as string;

  //   todo: initial value and validation schema
  const initialValues = { password1: "", password2: "" };
  const validationSchema = Yup.object({
    password1: Yup.string().required("field is required"),
    password2: Yup.string().oneOf(
      [Yup.ref("password1"), null],
      "Passwords must match"
    ),
  });

  //   todo: query and mutation
  const { data, mutateAsync: resetPassword, isLoading } = useResetMutation();

  // todo: context
  const { alert } = useAppContext();

  // todo: functions
  const handleSubmit = async (
    values: IFormData,
    submitProps: FormikHelpers<IFormData>
  ) => {
    await resetPassword({ email, token, password: values.password1 });
    if (data && data.status === "success") {
      submitProps.resetForm();
    }
  };

  //   todo: the return
  return (
    <div className="bg-primary flex items-center justify-center h-screen w-full">
      {alert && <AlertPrompt message={alert} />}
      {data && data.status === "success" ? (
        <p className="text-base italic">
          Password reset was successful. You will be redirected to the login
          page shortly.
        </p>
      ) : (
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
                    disabled={
                      formik.isSubmitting || !formik.isValid || isLoading
                    }
                  >
                    {isLoading ? "loading..." : "Reset"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResetPassword;
