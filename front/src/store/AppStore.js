import { observable, action } from "mobx";

export const screens = {
  A: "a",
  B: "b",
};

class AppStore {
  @observable currentScreen;
  @observable votings;

  constructor() {
    this.currentScreen = screens.MAIN;
    this.votings = [{
      creator: '0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40',
      topic: 'Should we execute mr. Badguy?',
      juryPks: [
        ['0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5', '0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5'],
        ['0x8528bc8e97b54568ba2660d300b135b14fb2dee1', '0x8528bc8e97b54568ba2660d300b135b14fb2dee1'],
        ['0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40', '0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40'],
        ['0x65dd7690901500fdd6b26f0a4d722e1e859ad301', '0x65dd7690901500fdd6b26f0a4d722e1e859ad301']
      ],
      quorum: 1,
      votes: 0,
      startTime: '1436397367',
      duration: 24
    }, {
      creator: '0x65dd7690901500fdd6b26f0a4d722e1e859ad301',
      topic: 'Should we disconnect from ventilator mrs. Illady?',
      juryPks: [
        ['0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5', '0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5'],
        ['0x8528bc8e97b54568ba2660d300b135b14fb2dee1', '0x8528bc8e97b54568ba2660d300b135b14fb2dee1'],
        ['0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40', '0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40'],
        ['0x65dd7690901500fdd6b26f0a4d722e1e859ad301', '0x65dd7690901500fdd6b26f0a4d722e1e859ad301']
      ],
      quorum: 2,
      votes: 1,
      startTime: '1536351200',
      duration: 48
    }, {
      creator: '0x8528bc8e97b54568ba2660d300b135b14fb2dee1',
      topic: 'Should centralized exchanges burn in hell as much as possible?',
      juryPks: [
        ['0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5', '0x4faf79ffc854e56c3012a6ecd55583fdc32b7eb5'],
        ['0x8528bc8e97b54568ba2660d300b135b14fb2dee1', '0x8528bc8e97b54568ba2660d300b135b14fb2dee1'],
        ['0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40', '0xA7D99Ad32b31B6F901bbC2F8EB8952fEa1653F40'],
        ['0x65dd7690901500fdd6b26f0a4d722e1e859ad301', '0x65dd7690901500fdd6b26f0a4d722e1e859ad301']
      ],
      quorum: 3,
      votes: 3,
      startTime: '1536340200',
      duration: 96
    }]
  }

  @action("set currentScreen")
  setCurrentScreen(currentScreen) {
    this.currentScreen = currentScreen;
  }

}

export default new AppStore();
