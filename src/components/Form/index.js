import get from "lodash/get";
import React from "react";
import {
  FormControl,
  Button,
  FormControlLabel,
  TextField,
  Checkbox,
} from "@material-ui/core";
import { useFormik } from "formik";
import { formatPhone } from "./phoneUtils";
import { sleep } from "./mockUtils";
import { validationSchema, initialValues } from "./schema";

function Form() {
  /**
   * We could destructure here for code cleanup,
   * but I want to print all props for demo purposes.
   */
  const formikProps = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(1000);
      alert("Form values printed to console");
      console.log(`Submitted: ${JSON.stringify(values, null, 2)}`);
    },
  });

  console.log(
    `Formik Props—Review Full Reference Doc.\nIt's a quick skim: https://bit.ly/2Af1UZN`,
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

  return (
    <div>
      <h1>Example</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          error={errors.firstName && touched.firstName}
          fullWidth
          helperText={errors.firstName}
          /**
           * MUI appends an asterisks if `required` prop is passed: https://bit.ly/3h0EOGO
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
           * see convo: https://bit.ly/3cOuVsl
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
    </div>
  );
}

export default Form;
