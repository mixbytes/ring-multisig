import React, { Component } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import moment from 'moment';
import Form from "react-jsonschema-form";

import AppStore from "../../store/AppStore";

import "./Voting.less";
import { getRingSignature } from '../../lib/ring'
import { getContract, getJudgments, waitTx } from '../../lib/eth'

// for demonstration
let keys = {
  "pubkeys": [
    {
      "x": "0x10dcc47fc42d72cf150628ff884e461ea68865d8b7a5d33ffd45123ba4f791a5",
      "y": "0x233664da9a15ed4676c7334211c2dadfec904dc2a79d24d414f02aefbaa88b9d"
    },
    {
      "x": "0x20378430cdb66570cce297cdbe77c648da748435a97592c9cf54e6796a6b26d2",
      "y": "0x1a81c44eb7b1fac2debfcd6ae51ba0d9ef29dc68d044e9dffaf5a4fdbf51c990"
    },
    {
      "x": "0x9e28465091b0c0e223a68d06e0155c319e15f7dc1f4affb2bed80b8bde73901",
      "y": "0x22b025b091ea84ce10ad8ec07184899b8cc2725a9f1b654df4e91e1b47815fa6"
    },
    {
      "x": "0x1b2d8049b9bbe84f34b659231bbb2d4519c2da0803ef4034ef4ea4406b8237df",
      "y": "0x201982b68d57fe5ee0dda1521ec4c8d5242c379022ac64342e7f03bafa2fb7f1"
    },
    {
      "x": "0x2770853c170abd0617b34144d3304afcc0d256659479231f605bf42feadb4038",
      "y": "0x205fa87b184b6dda389843a3730270cfebea66708f7be62cd77d748b6c0694c5"
    },
    {
      "x": "0x5895d2ceda6ce9f8adc6d796a0f02c7ce97bc4c0fb3ba3a5229ce3cfeb0d951",
      "y": "0x1dcea97bc4baf919e3a0cedfd27b8e9cfa9329a4e1da500e20159cc4cea10a54"
    },
    {
      "x": "0x11955dd923f7fced7a13d95331ccda46d7d86695e96a3066a8c49c6ed7e469c7",
      "y": "0xb98c9ca132feda9eec03320f3cd9239b95291200ee9d1fe43898431268d972e"
    },
    {
      "x": "0x4720510f55b5160c23c82db092fcf907d3eeeebf4e23eefcdd0db43d784f2cf",
      "y": "0x1afab767f19a9c19c0cd2d823974827decf09068a45617f5fa830aa634973c92"
    },
    {
      "x": "0x14db49cb6a1d283068e82b4d5f6bf304d23871e89e80d3caf95f887e5e2da917",
      "y": "0x2847f4d2354209ee1f22d2a8fb6086c429e2d20b6203ea31cf5ed5aaba1207f7"
    },
    {
      "x": "0x8edea30bd97f16b66ec4297a828ac96587847a22a0fbc5abe30724026dd1de6",
      "y": "0x1e125d022426585cfa4c8f3af6fccfc4890860963fecc7e8dd18f979cd8be664"
    }
  ],
  "privkeys": [
    "0x141fc3c2364deb96d96e15d10f141bc8ad66516572aa0c3756d52452e6b895cc",
    "0x14564e8de1e436ae7464b0f942d6058d147095590835439e1159926c01ee0112",
    "0x2c6e0e2ab94259e6e3c73ed71ba34026bb2ab0f9fcef43d2be7581dbb3e8daf6",
    "0x609077d3db04a6c892720b5176409cb6ea8ce3648e3de9529b3328e65e29ac1",
    "0x1ca3f093091b8b95120b30399893c7adc41d90a8da55923defecf6867f83e15a",
    "0xd93286bfdde96e997d45f25daa591c10c01951dc72887ec7a25059f773132c0",
    "0x1adce4fa183f1923252d4077b04e538324e76b7e99e0db7defa114d004e758b5",
    "0x5b564232e2b314d25774364546e5b6067f77b77b7695d064d5aa3732ca736d8",
    "0x24fceee418c1263cffa5f3f3e2ced0ccdcb341296c10bd51b362a1ab107235c0",
    "0xccda9b8f26b2a8cf88d40e2a8e3ee4d8c8c284cf49ac6032fd2316dea5ff0cf"
  ]
}


@observer
class Voting extends Component {

  makeDecision (data) {

    let sign = getRingSignature(
      data.formData.signMessage,
      {
        pubkeys: keys.pubkeys,
        privkey: data.formData.privKey,
        privkeyindex: keys.privkeys.indexOf(data.formData.privKey)
      }
    )
    console.log(sign)

    getContract().guilty(
      data.formData.judgmentHash, [sign.tau.x, sign.tau.y], sign.ctlist,
      (smth, tx) => {
        AppStore.loaderShow()
        waitTx(tx, null, () => {
          getJudgments((judgments) => {
            AppStore.loaderHide()
            AppStore.toggleAddVote()
            AppStore.setVotings(judgments)

          })
        })
      }
    )
  }

  render() {
    let {voting, i} = this.props;
    let startTime = moment.unix(voting.startTime);
    let endTime = startTime.clone().add({hours: voting.duration});

    let leftTime = Math.round(moment.duration({milliseconds: endTime - moment()}).asHours());
    let passedTime = voting.duration - leftTime;

    let passedTimePercent = Math.round(passedTime / voting.duration * 100);
    let leftTimePercent = 100 - passedTimePercent;

    let isFinished = leftTime <= 0;
    let isAccepted = voting.votes >= voting.quorum;
    let isRejected = isFinished && !isAccepted;
    let isActive = !isFinished && !isAccepted;

    let schema = {
      type: "object",
      required: ["privKey"],
      properties: {
        privKey: {
          type: "string",
          title: "Private key",
          description: "For demonstration purposes you can select one of the private keys for generated public keys",
          enum: keys.privkeys,
          default: keys.privkeys[0]
        },
        signMessage: {type: "string"},
        judgmentHash: {type: "string"}
      },
    };

    let ui_schema = {
      signMessage: {"ui:widget": "hidden"},
      judgmentHash: {"ui:widget": "hidden"}
    }

    return (
      <div className="voting" key={i}>
        <div className={classNames('status_badge', {
          active: isActive,
          accepted: isAccepted,
          rejected: isRejected
        })}>
          <span>
            {isActive && 'Active'}
            {isAccepted && 'Accepted'}
            {isRejected && 'Rejected'}
          </span>
        </div>

        <div className="voting_topic">
          {voting.topic}
        </div>

        <div className="voting_creator">
          <div className="row_name">Creator</div>
          <div>
            <a href={`https://rinkeby.etherscan.io/address/${voting.creator}`}>{voting.creator}</a>
          </div>
        </div>

        <div className="voting_jury">
          <div className="row_name">Jury</div>
          <div>
            {voting.juryPks &&
              voting.juryPks.map((juryPk, j) => (
                <div className="voting_jury_pk" key={j}>
                  {`${j}. [${juryPk[0]}, ${juryPk[1]}]`}
                </div>
              ))
            }
          </div>
        </div>

        <div className="voting_timeframe-info">
          {`Voting started at ${startTime.format('ll, HH:mm Z')}, `}
          {`voting duration ${voting.duration} hours, `}
          {isFinished ? <b>voting finished.</b> : `${leftTime} hours left.`}
        </div>

        {leftTime > 0 &&
          <div className="voting_timeline">
            {passedTime > 0 &&
              <div className="passed" style={{width: `${passedTimePercent}%`}}>
                <div>{`Passed: ${passedTime} hours`}</div>
              </div>
            }
            <div className="left" style={{width: `${leftTimePercent}%`}}>
              <div>{`Left: ${leftTime} hours`}</div>
            </div>
          </div>
        }

        <div className="voting_votes-info">
          {`${voting.votes} of ${voting.juryPks.length} juries voted. `}
          {`${voting.quorum} ${voting.quorum > 1 ? 'votes are' : 'vote is'} needed for quorum. `}
          {isAccepted && <b>Proposal accepted.</b>}
          {isRejected && <b>Proposal rejected.</b>}
        </div>

        <div className="voting_votes-and-quorum">
          {[...Array(voting.juryPks.length).keys()].map((j) => (
            <div key={j} className={classNames(
              {'quorum': j + 1 <= voting.quorum},
              {'votes':  j + 1 <= voting.votes}
            )}>
              {(j + 1 === voting.votes || (j + 1 === voting.quorum && voting.votes === 0)) &&
                <div>votes: {voting.votes}</div>
              }
              {j + 1 === voting.quorum &&
                <div>quorum: {voting.quorum}</div>
              }
              {j + 1 === voting.juryPks.length &&
                <div>jury: {voting.juryPks.length}</div>
              }
            </div>
          ))}
        </div>

        {isActive &&
          <div className="vote_form">
            <Form schema={schema} uiSchema={ui_schema}
              onChange={() => console.log("changed")}
              onSubmit={this.makeDecision}
              onError={() => console.log("errors")}
                  formData={ {signMessage: voting.signMessage, judgmentHash: voting.hash} }
            >
              <div className="vote_btn">
                <button className="btn" type="submit">Cast a Vote</button>
              </div>
            </Form>
          </div>
        }

      </div>
    )
  }
}

export default Voting;
