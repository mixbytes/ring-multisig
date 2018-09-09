import React, { Component } from "react";
import { observer } from "mobx-react";
import Form from "react-jsonschema-form";

import AppStore from "../../store/AppStore";
import Loader from "../../helpers/loader/Loader";
import "./AddForm.less";
import { getContract, getJudgments, waitTx } from '../../lib/eth'

@observer
class AddForm extends Component {
  constructor(props) {
    super(props);
    AppStore.toggleLoader.bind(AppStore);
    AppStore.toggleAddVote.bind(AppStore)
    AppStore.loaderShow.bind(AppStore);
    AppStore.loaderHide.bind(AppStore);
    AppStore.setVotings.bind(AppStore);
  }

  addJudgment (e, d) {
    let keysX = [];
    let keysY = [];
    e.formData.publicKeys.trim().split('\n').forEach(el => {
      let a,b;
      [a,b] = el.split(',')
      keysX.push(a.trim())
      keysY.push(b.trim())
    })

    try {
      getContract().add(
        e.formData.judgmentMatter,
        keysX,
        keysY,
        e.formData.threshold,
        (new Date() / 1000) + e.formData.deadline * 60 * 60,
        (smth, tx) => {
          AppStore.loaderShow();
          waitTx(tx, null, () => {
            getJudgments((judgments)=>{
              AppStore.loaderHide();
              AppStore.toggleAddVote();
              AppStore.setVotings(judgments);

            });
          })
        }
      );
    } catch (e) {
      alert(e.message);
    }

  }

  render() {
    const schema = {
      type: "object",
      required: ["judgmentMatter", "publicKeys", "threshold", "deadline"],
      description: "For demonstration purposes everyone can add Judgement. In real life only real Judge must be able to do this",
      properties: {
        judgmentMatter: {
          type: "string",
          title: "Judgement matter",
          default: "Should we execute Jonh Smith?"
        },
        publicKeys: {
          type: "string",
          title: "Jury public key pairs (X, Y - one pair per string)",
          description: "For demonstration purposes we've generated several public keys, so you needn't to do it by yourself",
          default: "" +
            "0x10dcc47fc42d72cf150628ff884e461ea68865d8b7a5d33ffd45123ba4f791a5,0x233664da9a15ed4676c7334211c2dadfec904dc2a79d24d414f02aefbaa88b9d\n" +
            "0x20378430cdb66570cce297cdbe77c648da748435a97592c9cf54e6796a6b26d2,0x1a81c44eb7b1fac2debfcd6ae51ba0d9ef29dc68d044e9dffaf5a4fdbf51c990\n" +
            "0x9e28465091b0c0e223a68d06e0155c319e15f7dc1f4affb2bed80b8bde73901,0x22b025b091ea84ce10ad8ec07184899b8cc2725a9f1b654df4e91e1b47815fa6\n" +
            "0x1b2d8049b9bbe84f34b659231bbb2d4519c2da0803ef4034ef4ea4406b8237df,0x201982b68d57fe5ee0dda1521ec4c8d5242c379022ac64342e7f03bafa2fb7f1\n" +
            "0x2770853c170abd0617b34144d3304afcc0d256659479231f605bf42feadb4038,0x205fa87b184b6dda389843a3730270cfebea66708f7be62cd77d748b6c0694c5\n" +
            "0x5895d2ceda6ce9f8adc6d796a0f02c7ce97bc4c0fb3ba3a5229ce3cfeb0d951,0x1dcea97bc4baf919e3a0cedfd27b8e9cfa9329a4e1da500e20159cc4cea10a54\n" +
            "0x11955dd923f7fced7a13d95331ccda46d7d86695e96a3066a8c49c6ed7e469c7,0xb98c9ca132feda9eec03320f3cd9239b95291200ee9d1fe43898431268d972e\n" +
            "0x4720510f55b5160c23c82db092fcf907d3eeeebf4e23eefcdd0db43d784f2cf,0x1afab767f19a9c19c0cd2d823974827decf09068a45617f5fa830aa634973c92\n" +
            "0x14db49cb6a1d283068e82b4d5f6bf304d23871e89e80d3caf95f887e5e2da917,0x2847f4d2354209ee1f22d2a8fb6086c429e2d20b6203ea31cf5ed5aaba1207f7\n" +
            "0x8edea30bd97f16b66ec4297a828ac96587847a22a0fbc5abe30724026dd1de6,0x1e125d022426585cfa4c8f3af6fccfc4890860963fecc7e8dd18f979cd8be664\n"
        },
        threshold: {
          type: "integer",
          title: "Quorum to accept",
          default: 1,
          minimum: 1
        },
        deadline: {
          type: "integer",
          title: "Time to make decision (in hours)",
        }
      }
    };

    const uiSchema =  {
      publicKeys: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 12
        },
        "ui:placeholder": "0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5, 0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5\n0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5, 0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5"
      }
    };

    return (
      <div className="add-form">
        <Form schema={schema} uiSchema={uiSchema}
          onChange={() => console.log("changed")}
          onSubmit={this.addJudgment}
          onError={() => console.log("errors")}
        >
          <div className="button-n-loader">
            <button type="submit">Submit vote</button>
            {AppStore.loader &&
              <div className="loader">
                <Loader width={50} />
                <div>Waiting for miners</div>
              </div>
            }
          </div>
        </Form>
      </div>
    );
  }
}

export default AddForm;
