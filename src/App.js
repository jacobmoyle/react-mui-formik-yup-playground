import React from "react";
import { Box, Divider, Container, Typography } from "@material-ui/core";
import Form from "./components/Form";

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Formik, MUI, & Yup Form Test
        </Typography>
        <Divider />
        <Form />
      </Box>
    </Container>
  );
}
