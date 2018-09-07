import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { observer } from "mobx-react";

import "./App.less";
import AppStore, { screens } from "../store/AppStore";

@observer
class App extends Component {
  render() {
    let content;
    switch (AppStore.currentScreen) {
      case screens.A:
        content = "Hello world";
        break;

      default:
        break;
    }
    return <div className="app screen flex">{content}</div>;
  }
}

export default hot(module)(App);
