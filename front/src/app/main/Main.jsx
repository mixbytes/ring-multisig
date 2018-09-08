import React, { Component } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import moment from 'moment';

import "./Main.less";
import AppStore, { screens } from "../../store/AppStore";

@observer
class Main extends Component {

  Voting(voting, i) {
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
          <div className="vote_btn">
            <button className="btn">Push me to vote!</button>
          </div>
        }

      </div>
    )
  }

  render() {
    let votings = AppStore.votings;
    return (
      <div>
        <div className="add_btn">
          <button className="btn">Add some new fatal voting</button>
        </div>
        {votings &&
          votings.map((voting, i) => (
            this.Voting(voting, i)
          ))
        }
      </div>
    );
  }
}

export default Main;
