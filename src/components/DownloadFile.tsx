import { isFile } from "@rsksmart/rif-storage";
import { saveAs } from "file-saver";
import { Form, Formik } from "formik";
import UploadProvider from "providers/UploadProvider";
import React from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";

interface IFormValues {
  hash: string;
}

interface IFormErrors {
  hash?: string;
}

export default () => (
  <div className="text-right">
    <UploadProvider.Consumer>
      {({ actions: { download } }) => (
        <Formik
          validate={async ({ hash }: IFormValues) => {
            const errors: IFormErrors = {};
            if (!hash) errors.hash = "Required";
            return errors;
          }}
          onSubmit={async ({ hash }: IFormValues, actions) => {
            const result = await download(hash);
            if (isFile(result)) {
              saveAs(new Blob([result as Buffer]));
            } else if (Object.keys(result).length === 1) {
              const filename = Object.keys(result)[0]
              saveAs(new Blob([result[filename].data]), filename);
            } else {
              // TODO: Offer download of the files
              console.log(Object.keys(result));
            }
            actions.resetForm();
          }}
          initialValues={{
            hash: ""
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            isValid,
            errors
          }) => (
            <Form onSubmit={handleSubmit}>
              <InputGroup className="mb-3" style={{ marginTop: "1em" }}>
                <FormControl
                  aria-label="Hash"
                  aria-describedby="basic-addon2"
                  name="hash"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={values.hash}
                  autoComplete="off"
                  autoFocus
                  required
                />
              </InputGroup>
              <div className="text-left">
                {errors.hash && (
                  <small style={{ color: "red" }}>{errors.hash}</small>
                )}
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={!isValid}
              >
                Retrieve
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </UploadProvider.Consumer>
  </div>
);
