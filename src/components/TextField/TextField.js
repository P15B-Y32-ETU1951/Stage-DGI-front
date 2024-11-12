import React from "react";


// reactstrap components
import {
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

class Forms extends React.Component {
  render() {
    return (
      <>
        <Form>
          <Input
            className="form-control-alternative"
            placeholder="Write a large text here ..."
            rows="3"
            type="textarea"
          />
        </Form>
      </>
    );
  }
}

export default Forms;