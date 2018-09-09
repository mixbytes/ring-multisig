import { observable, action } from "mobx";

export const screens = {
  A: "a",
  B: "b",
};

class AppStore {
  @observable currentScreen;
  @observable votings;
  @observable showAddVote;

  constructor() {
    this.currentScreen = screens.MAIN;
    this.votings = [];
    this.showAddVote = false;
    this.showLoader = false;
  }

  @action("set currentScreen")
  setCurrentScreen(currentScreen) {
    this.currentScreen = currentScreen;
  }

  @action("toggle add vote")
  toggleAddVote() {
    this.showAddVote = !this.showAddVote;
  }

  @action('set votings')
  setVotings (votings) {
    //input is in blockchain format
    let res = []
    votings.forEach(el => {
      let pks = []
      for(let i=0;i<el[1].length;i++) {
        pks.push([web3.toHex(el[1][i]), web3.toHex(el[2][i])])
      }

      res.push({
        creator: el[9],
        topic: el[0],
        juryPks: pks,
        quorum: el[3],
        votes: el[5],
        startTime: el[7],
        duration: (el[8]-el[7])/3600,
        signMessage: el[6]
      })
    })

    this.votings = res
  }

  @action("toggle loader")
  toggleLoader() {
    this.showLoader = !this.showLoader;
  }

  @action("show loader")
  loaderShow() {
    this.showLoader = true;
  }

  @action("hide loader")
  loaderHide() {
    this.showLoader = false;
  }

}

export default new AppStore();
