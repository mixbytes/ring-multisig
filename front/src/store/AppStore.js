import { observable, action } from "mobx";

export const screens = {
  A: "a",
  B: "b",
};

class AppStore {
  @observable currentScreen;

  constructor() {
    this.currentScreen = screens.A;
  }

  @action("set currentScreen")
  setCurrentScreen(currentScreen) {
    this.currentScreen = currentScreen;
  }

}

export default new AppStore();
