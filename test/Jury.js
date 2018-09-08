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

    await jury.add('Do smth', [1, 2], 1, {from: roles.owner});
    assert.equal(
      'Do smth',
      (await jury.getJudgment(1))[0]
    );

    assert.equal(
      2,
      (await jury.getJudgment(1))[1][1].valueOf()
    );
  });



});
