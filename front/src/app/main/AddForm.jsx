import React, { Component } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import Form from "react-jsonschema-form";

import AppStore from "../../store/AppStore";

import "./AddForm.less";

@observer
class AddForm extends Component {
  render() {
    const schema = {
      type: "object",
      required: ["title", "publicKeys", "threshold", "deadline"],
      properties: {
        judgmentMatter: {
          type: "string",
          title: "Judgement matter",
          default: "Should we execute Jonh Smith?"
        },
        publicKeys: {
          type: "string",
          title: "Jury public key pairs (X, Y - one pair per string)",
        },
        threshold: {
          type: "integer",
          title: "Quorum to accept",
          default: 1,
          minimum: 1
        },
        deadline: {
          type: "integer",
          title: "Voting deadline (Unix timestamp)",
        }
      }
    };

    const uiSchema =  {
      publicKeys: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 5
        },
        "ui:placeholder": "0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5, 0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5\n0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5, 0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5"
      }
    };

    return (
      <div className="add-form">
        <Form schema={schema} uiSchema={uiSchema}
          onChange={console.log("changed")}
          onSubmit={console.log("submitted")}
          onError={console.log("errors")}
        >
          <div>
            <button type="submit">Submit vote</button>
          </div>
        </Form>
      </div>
    );
  }
}

export default AddForm;
