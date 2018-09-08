import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { observer } from "mobx-react";

import "./App.less";
import AppStore, { screens } from "../store/AppStore";
import Main from "./main/Main";

@observer
class App extends Component {
  constructor(props) {
    super(props)
    this.currentScreen = screens.MAIN;
  }

  render() {
    let content;
    switch (AppStore.currentScreen) {
      case screens.MAIN:
        content = <Main />;
        break;

      default:
        break;
    }
    return <div className="app flex">{content}</div>;
  }
}

export default hot(module)(App);
