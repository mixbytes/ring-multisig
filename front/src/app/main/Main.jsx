import React, { Component } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import moment from 'moment';
import Form from "react-jsonschema-form";

import AppStore from "../../store/AppStore";
import AddForm from "./AddForm";
import Voting from "./Voting";

import "./Main.less";
import { getJudgments } from '../../lib/eth'

@observer
class Main extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    AppStore.loaderShow.bind(AppStore);
    AppStore.loaderHide.bind(AppStore);
    AppStore.setVotings.bind(AppStore);

    AppStore.loaderShow();
    getJudgments((judgments)=>{
      AppStore.loaderHide();
      AppStore.setVotings(judgments);
    });
  }


  render () {
    let votings = AppStore.votings;

    return (
      <div>
        <h1>Ring Signatures (Barreto-Naehrig 256 bit Elliplic Curve) based anonymous voting</h1>
        <h3>Create a new proposal (i.e. death sentence; life support disconnet). Add juries. Wait for the consensus
          decision.</h3>

        <div className="add_btn">
          <button className="btn" onClick={AppStore.toggleAddVote.bind(AppStore)}>New Proposal</button>
        </div>

        {AppStore.showAddVote &&
        <AddForm/>
        }

        {votings &&
        votings.map((voting, i) => (
          <Voting voting={voting} i={i} key={i}/>
        ))
        }
      </div>
    );
  }
}

export default Main;
