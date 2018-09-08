'use strict';

const Single = artifacts.require("Single.sol");
const l = console.log;

contract('Single', function (accounts) {


  let single;

  beforeEach(async function () {
    single = await Single.new(
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
      Math.round(new Date/1000) + 60
    );
  });

  it("complex test", async function () {

    assert.equal(
      'Do smth',
      (await single.getJudgment())[0]
    );
    assert.equal(
      "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf",
      web3.toHex((await single.getJudgment())[1][1])
    );
    //l((await single.getJudgment())[6])
    // message 0x14462573adecc6b213bfd0290aea56d908c2b491d3a26b1e35febceb9153c784

    let sign0 = {
      "tau": {
        "x": "0x2fd2255f903c735765271bf82a924a7c9dbbcca28711212afa694c16cdf3bba",
        "y": "0x989e0e4285df0ba6c247c2917854cfb7b36ac2ffae09931bbc8842b9f7a76e6"
      },
      "ctlist": [
        "0x2ecbdfe37e0b6dc7001c7f78ee4199187bb41bf1de7cbf9a89c5f88a288cb513",
        "0x2d09f708ba6fe4d23e7c9076c6276f7461aa1865f985c424a479d91d58cd09c1",
        "0x16c382f3dd47fb3956a080ee903437f151a8df19239ec0a807a75aebc3ba6eeb",
        "0x27d524176ce2a306a565031398dcd76818b412d40bd1612c50501b3f8a361a21",
        "0x2a0253a14e8bdb248ef5c485c478fb9eacffe0acc70bdb3dbe789cd94b7e54a9",
        "0x2d748edc52a1bffbebf92623d665140136ee56e0ae86305cb45da02a9768078f"
      ]
    }

    let sign1 = {
      "tau": {
        "x": "0xbd3980e3db51fc79403bb892ce1fe882342d0465f901d9a7bb2e6d35c495a65",
        "y": "0x9216aec5a21c9f14082e9a9315e618c135f1ec3fbb2ea7e214faf308862aaef"
      },
      "ctlist": [
        "0x269751c4355dcc05ca53d608ab436e6788fc1116a06b8c1d527b2f10e11de949",
        "0x24cd93c468dd2c36b3a3c7e962c542747e4ef16fb622daaa9a75a854e8570788",
        "0x3e45b74c65f1beb65a5b0eef32f2480d2f6da5650a326f8bb2c622b5b732a8d",
        "0x2bc2a1fd69a5190131710e1b79adbb970034bf26461151e7bcd025a41cac4a9b",
        "0x7e7aef85f9fe9d2e6c6e89b2d416b89f619d9f96ccd7d0defed671b486c71d1",
        "0x65b4ff719b30f43452aeb87c354b0c1e66d81e4756d436703610b4bcde12637"
      ]
    }

    let judg;

    await single.guilty( [sign0.tau.x, sign0.tau.y], sign0.ctlist)
    judg = await single.getJudgment()
    assert.equal(false, judg[4]) //guilty
    assert.equal(1, judg[5].toString()) //count

    await single.guilty( [sign1.tau.x, sign1.tau.y], sign1.ctlist)
    judg = await single.getJudgment()
    assert.equal(true, judg[4]) //guilty
    assert.equal(2, judg[5].toString()) //count

  });



});
