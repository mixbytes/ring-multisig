'use strict';

const Jury = artifacts.require("Jury.sol");
const l = console.log;

contract('Jury', function (accounts) {

  const roles = {
    owner: accounts[7],
  };

  let jury;

  beforeEach(async function () {
    jury = await Jury.new({from: roles.owner});
  });

  it("test", async function () {

    await jury.add(
      'Do smth',
      ["0x27e073fe3485b7ab97de5813342c3ce3dd19eba467a6b5f61b092813e67325e2", "0xf5165507a4f67c89fd40603a3765e53a3656bf3c247421b6a69a05e0a7fabb"],
      ["0x639bbbc72ef12bc7449c08a4ac2d7d7a9ed0484e4d5d6ee4f4b6fa5844043c2", "0x6d9e4c9c4054e9f1f5d27cfad56c034f1654bc88ae6916722424c565976ef88"],
      1,
      {from: roles.owner}
    );
    assert.equal(
      'Do smth',
      (await jury.getJudgment(1))[0]
    );

    assert.equal(
      "0xf5165507a4f67c89fd40603a3765e53a3656bf3c247421b6a69a05e0a7fabb",
      web3.toHex((await jury.getJudgment(1))[1][1])
    );
  });



});
