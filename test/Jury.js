'use strict';

const Jury = artifacts.require("Jury.sol");
const l = console.log;

contract('Exchange', function (accounts) {

  const roles = {
    owner: accounts[7],
  };

  let jury;

  beforeEach(async function () {
    jury = await Jury.new({from: roles.owner});
  });

  it("test", async function () {

    await jury.add('Do smth', 12, 7, {from: roles.owner});
    assert.equal(
      'Do smth',
      (await jury.getJudgment(1))[0]
    );
  });



});
