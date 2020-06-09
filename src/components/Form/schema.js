import * as Yup from "yup";

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

/**
 * Yup supports custom validations.
 * See post: https://medium.com/@arkadyt/how-does-yup-addmethod-work-creating-custom-validation-functions-with-yup-8fddb71a5470
 */
Yup.addMethod(Yup.string, "isFooBar7331", function (args) {
  const { message = 'password is not "fooBar7331"' } = args;
  return this.test("isFooBar7331", message, function (value) {
    const {
      path, // property name,
      createError, // new ValidationError
    } = this;
    const isInFact1337 = value === "isFooBar7331";

    return isInFact1337 || createError({ path, message });
  });
});

export const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  middleName: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  age: Yup.number().positive().integer(),
  /**
   * Yup provides regex formatting, but not adding for time
   * See docs: https://github.com/jquense/yup#stringmatchesregex-regex-message-string--function-schema
   */
  phone: Yup.string(),
  /**
   * Further reading:
   * - Generating Schemas: https://codedaily.io/tutorials/41/How-to-Create-an-Optional-Dynamic-Validation-Schema-based-on-a-Value-with-the-Yup-Validation-Library
   * - Dependant values: https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema
   * - Referencing other values: https://til.hashrocket.com/posts/vahuw4phan-check-the-password-confirmation-with-yup
   */
  optionalField: Yup.object().shape({
    checked: Yup.bool(),
    input: Yup.string().when(["checked"], {
      is: true, // alternatively: (val) => val == true
      then: Yup.string().required("Required if checkbox is selected"),
      otherWise: Yup.string(),
    }),
  }),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .isFooBar7331({ message: undefined }) // Custom validator defined via `Yup.addMethod`
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required("No password provided."),
});

const schema = {
  initialValues,
  validationSchema,
};

export default schema;
