import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({ input, width, placeholder, meta: { touched, error }, dataTest, ...rest }) => {
  return (
    <Form.Field error={touched && !!error}>
      <DatePicker
        {...rest}
        dateFormat='yyyy-MM-dd'
        placeholderText={placeholder}
        // TODO Default to today's date
        selected={input.value ? new Date(input.value) : new Date()}
        data-test={dataTest}
        onChange={input.onChange}
        onBlur={input.onBlur}
        // Prevent user from typing in field
        onChangeRaw={e => e.preventDefault()}
      />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
