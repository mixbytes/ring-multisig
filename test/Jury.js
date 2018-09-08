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

  it("complex test", async function () {

    await jury.add(
      'Do smth',
      [
        "0x26db77bfb9f8a2876266d5302eb034769fdde10049b6849abb9f77592ccfb91d",
        "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf",
        "0x5506a71b93730e9f8abc99b0ef8e2940fdfdfd2a6c3892bb3a5f47c4634e31c"
      ],
      [
        "0x1e40a7be578811ce812589748470effdb7f0185338ce63adcc2bf94f94c5180f",
        "0x9ff14963bc007efecf73247b0e458dd2cac4ec2a7aa11a13a87b90843be5969",
        "0x163ec7c4820c2234c35c4b309573367def35441d8e14b7fd2a29f2e4cd19b12a"
      ],
      2,
      {from: roles.owner}
    );

    let indexes = await jury.getJudgmentsIndexes();
    let index0 = indexes[0];

    assert.equal(
      'Do smth',
      (await jury.getJudgment(index0))[0]
    );
    assert.equal(
      "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf",
      web3.toHex((await jury.getJudgment(1))[1][1])
    );
    // message 0x1eb85e5a5c307e437593ffd4e1a37ec30ef6dfeddcfb1c8e312de7c2a9af3196

    //await jury.guily

    //l(await jury.getJudgment(1));
  });



});
