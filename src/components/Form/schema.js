import { string, number, object, bool } from "yup";

export const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  age: "",
  phone: "",
  optionalField: {
    checked: false,
    input: "",
  },
  email: "",
  password: "",
};

export const validationSchema = object().shape({
  firstName: string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  middleName: string().min(2, "Too Short!").max(50, "Too Long!"),
  lastName: string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  age: number().positive().integer(),
  /**
   * Yup provides regex formatting, but not adding for time
   * See docs: https://bit.ly/2zeblrR
   */
  phone: string(),
  /**
   * Further reading:
   * - Generating Schemas: https://bit.ly/2Yh1x90
   * - Dependant values: https://bit.ly/2XLiUzP
   */
  optionalField: object().shape({
    checked: bool(),
    input: string().when(["checked"], {
      is: true, // alternatively: (val) => val == true
      then: string().required("Your selection make this required ;)"),
      otherWise: string(),
    }),
  }),
  email: string().email("Invalid email").required("Required"),
  password: string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

const schema = {
  initialValues,
  validationSchema,
};

export default schema;
