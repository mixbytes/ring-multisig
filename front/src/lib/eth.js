import {constants} from "../constants/constants.js"
import Jury from './../../../build/contracts/Jury.json'



export let web3 = window.Web3 ? new window.Web3(window.web3.currentProvider) : undefined;

export let getContract = function() {
  return web3.eth.contract(Jury.abi).at(constants.contract_addr);
};

export let waitTx = (tx, txres, successCallback) => {
  if (txres) {
    return successCallback()
  }

  setTimeout(
    () => {
      web3.eth.getTransactionReceipt(
        tx,
        (smth, txres) => {
          waitTx(tx, txres, successCallback)
        }
      )
    },
    3000
  )

}

function reduceJudgments (hashes, results, finalCallback) {
  if (!hashes.length) {
    finalCallback(results)
    return
  }
  getContract().getJudgment(hashes.pop(), (error, response) => {
    results.push(response)
    reduceJudgments(hashes, results, finalCallback)
  })
}

export let getJudgments = (finalCallback) => {
  getContract().getJudgmentsIndexes((error, response) => {
    if (error) {
      alert(error)
      return
    }

    reduceJudgments(response, [], finalCallback)
  })
}
