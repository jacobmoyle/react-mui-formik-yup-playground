import get from "lodash/get";
import React from "react";
import {
  FormControl,
  Button,
  FormControlLabel,
  TextField,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useFormik } from "formik";
import { formatPhone } from "./phoneUtils";
import { sleep } from "./mockUtils";
import { validationSchema, initialValues } from "./schema";
import DisplayFormikState from "../DisplayFormikState";

function Form() {
  /**
   * We could destructure here for code cleanup, but we're logging for demo purposes.
   */
  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(1000);
      alert("Form values printed to console");
      console.log(`Submitted: ${JSON.stringify(values, null, 2)}`);
    },
    validate: (values, props) => {
      console.log("VALIDATE", values, props);
    },
  });

  console.log(
    `Formik Props—Review Full Reference Doc.
    \nIt's a quick skim: https://jaredpalmer.com/formik/docs/api/formik#reference`,
    formikProps
  );

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldValue,
    touched,
    values,
    dirty,
  } = formikProps;
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div>
      <h1>Example</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          error={errors.firstName && touched.firstName}
          fullWidth
          helperText={errors.firstName}
          /**
           * MUI appends an asterisks if `required` prop is passed.
           * see: https://material-ui.com/components/text-fields/#form-props
           *
           * Because we are utilizing pure JS form validation,
           * I've manually added them. There may be a better way.
           */
          label="First Name *"
          margin="normal"
          name="firstName"
          onBlur={handleBlur}
          onChange={handleChange}
          variant="outlined"
          value={values.firstName}
        />
        <TextField
          error={errors.middleName && touched.middleName}
          fullWidth
          helperText={errors.middleName}
          label="Middle Name"
          margin="normal"
          name="middleName"
          onBlur={handleBlur}
          onChange={handleChange}
          variant="outlined"
          value={values.middleName}
        />
        <TextField
          error={errors.lastName && touched.lastName}
          fullWidth
          helperText={errors.lastName}
          label="Last Name *"
          margin="normal"
          name="lastName"
          onBlur={handleBlur}
          onChange={handleChange}
          variant="outlined"
          value={values.lastName}
        />
        <TextField
          error={errors.email && touched.email}
          fullWidth
          helperText={errors.email}
          label="Email *"
          margin="normal"
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          type="email"
          value={values.email}
          variant="outlined"
        />
        {/**
         * Thoughts Formik/Yup Password Validations
         * -------------------------------------------
         *
         * The Formik and Yup integration is still in progress. The main issue I ran into
         * Formik's validationSchema (explicitly made for Yup) is the lack of flexibility.
         * e.g., Using any of Yup's `validate` options:
         *  - `strict`: only validate the input, and skip any coercion or transformation
         *  - `abortEarly`: return from validation methods on the first error rather than after all validations run.
         *  - `stripUnknown`: remove unspecified keys from objects.
         *  - `recursive`: when false validations will not descend into a nested schema (relevant for objects or arrays).
         *  - `context`: any context needed for validating schema conditions (see: when())
         *
         * Disabling `abortEarly` is particularly desirable—Yup enables this by default, returning one error at
         * a time. A common (and correct) request is to show all validations against an individual field, allowing
         * a User sees all requirements (rather than working through them one at a time) and 'checking them off.'
         * as the User meets each requirement. Here are some basic examples:
         * - [Screenshot](http://netdna.webdesignerdepot.com/uploads/2011/12/step141.jpg)
         * - [Apple Security Docs](https://support.apple.com/en-us/HT201303)
         *
         * A middle ground would be to list all requirements separately while allowing the default behavior of
         * providing a single validation error (per field) at a time. It appears to be what NPM is doing under
         * the hood on their [Sign Up Page](https://www.npmjs.com/signup) and would avoid having to roll custom
         * validation solutions within the Form `validation` callback. In the meantime, there are active Pull
         * Requests allowing Formik to accept schema options.
         * - [An older yet active thread](https://github.com/jaredpalmer/formik/issues/243)
         * - [PR opened May 31st, 2019](https://github.com/jaredpalmer/formik/pull/1573)
         *
         * Sources:
         * - [validationSchema](https://jaredpalmer.com/formik/docs/guides/validation#validationschema)
         * - [Yup Validate options](https://github.com/jquense/yup#mixedvalidatevalue-any-options-object-promiseany-validationerror)
         * - [Formiks Hard coded Yup validation Options](https://github.com/jaredpalmer/formik/blob/master/packages/formik/src/Formik.tsx#L1081)
         */}
        <TextField
          error={errors.password && touched.password}
          fullWidth
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          label="Password *"
          margin="normal"
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          value={values.password}
          variant="outlined"
        />
        <ul>
          <li>should be 8 chars minimum</li>
          <li>isFooBar7331</li>
        </ul>
        <TextField
          error={errors.phone && touched.phone}
          fullWidth
          helperText={
            errors.phone ? errors.phone : "Type: String—Formats input onBlur"
          }
          label="Phone Number"
          margin="normal"
          name="phone"
          /**
           * The following is an example on formatting input.
           * Formik is working on a 'parse' and 'format' API to clean this up.
           * see convo: https://github.com/jaredpalmer/formik/issues/1525
           *
           * Alternatively, we could create a custom step within Yup.
           * Example: https://github.com/jquense/yup#yupaddmethodschematype-schema-name-string-method--schema-void
           */
          onBlur={(event) => {
            setFieldValue(
              "phone",
              formatPhone(values["phone"], initialValues.phone)
            );
            handleBlur(event);
          }}
          onChange={handleChange}
          value={values.phone}
          variant="outlined"
        />
        <TextField
          error={errors.age && touched.age}
          helperText={errors.age ? errors.age : "Type: Number"}
          label="Age"
          margin="normal"
          name="age"
          onBlur={handleBlur}
          onChange={handleChange}
          type="number"
          value={values.age}
          variant="outlined"
        />
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            style={{ display: "block" }}
            control={
              <Checkbox
                checked={values.optionalField.checked}
                onChange={handleChange}
                name="optionalField.checked"
                color="primary"
              />
            }
            label="Add Required Field"
          />
        </FormControl>
        {values.optionalField.checked && (
          <TextField
            error={
              get(errors, "optionalField.input", false) &&
              get(touched, "optionalField.input", false)
            }
            fullWidth
            helperText={get(errors, "optionalField.input", false)}
            label="Conditionally Required Field *"
            margin="normal"
            name="optionalField.input"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.optionalField.input}
            variant="outlined"
          />
        )}
        <Button
          color="primary"
          disabled={isSubmitting}
          type="submit"
          variant="contained"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        <Button
          disabled={isSubmitting || !dirty}
          onClick={resetForm}
          variant="text"
        >
          Reset Form
        </Button>
      </form>
      <DisplayFormikState {...formikProps} />
    </div>
  );
}

export default Form;
