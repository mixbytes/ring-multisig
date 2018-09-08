import {constants} from "../constants/constants.js"
import Jury from './../../../build/contracts/Jury.json'



export let web3 = window.Web3 ? new window.Web3(window.web3.currentProvider) : undefined;

export let getContract = function() {
  return web3.eth.contract(Jury.abi).at(constants.contract_addr);
};

export let waitTx = async (tx, successCallback) => {
  if (tx) {
    return successCallback()
  }
  console.log(123)
  await sleep(3000);
  web3.eth.getTransactionReceipt(
    error,
    tx,
    async (smth, tx) => {
      waitTx(tx, successCallback)
    }
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
