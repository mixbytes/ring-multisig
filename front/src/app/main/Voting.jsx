import React, { Component } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import moment from 'moment';
import Form from "react-jsonschema-form";

import AppStore from "../../store/AppStore";

import "./Voting.less";

@observer
class Voting extends Component {

  makeDecision(data) {
    console.log(data.formData)
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
          "enum": [
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
          ],
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
              <input type="hidden" name="signMessage" value={voting.signMessage}/>
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
