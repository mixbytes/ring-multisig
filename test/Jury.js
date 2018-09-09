'use strict';

import * as BigInteger from 'jsproover-mixbytes/prover/bigInteger/bigInteger';
import { ECCurve } from 'jsproover-mixbytes/prover/curve/curve';

const secureRandom = require("secure-random");
const BN = require("bn.js");
const ethereumjs_util = require("ethereumjs-util");

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


  function getRingSignature(message, ringdata) {
	const bnCurve = new ECCurve('bn256');
	const order = bnCurve.order;
	const signatureGenerator = bnCurve.generator;

	const N_signer = ringdata.privkeyindex;
	let pk = new BigInteger.BNCLASS(ringdata.privkey.substr(2), 16, "be")
	pk = pk.umod(order);

	// [FIXME] - remove trash with substr
	// let message = "0x14462573adecc6b213bfd0290aea56d908c2b491d3a26b1e35febceb9153c784";
	let hashp = bnCurve.hashInto(message.substr(2));

	// Calculate Tau
	let hashSP = hashp.mul(pk);
	// await l(hashSP.serialize(true));

	let hash_acc = ethereumjs_util.sha256(Buffer.concat([hashp.serialize(true).slice(0,32), hashSP.serialize(true)]));
	
	let csum = new BigInteger.BNCLASS(0, 16, "be");
	let gen = bnCurve.generator;

	let ctlist = [];
	let a = bnCurve.zero;
	let b;
	let ri;

	for(let j = 0; j < ringdata.pubkeys.length; j++) {
		if (j != N_signer) {
			let data = secureRandom(32, {type: 'Buffer'});
        	let cj = new BN(data, 16, "be");
        	data = secureRandom(32, {type: 'Buffer'});
        	let tj = new BN(data, 16, "be");

			// ParameterPointAdd returns the addition of c scaled by cj and tj as a curve poinT
			let p1 = gen.mul(tj);
			let pubk = bnCurve.pointFromCoordinates(ringdata.pubkeys[j].x.substr(2), ringdata.pubkeys[j].y.substr(2));
			let p2 = pubk.mul(cj);
			a = p1.add(p2);

			// HashPointAdd returns the addition of hashSP scaled by cj and c scaled by tj
			let p3 = hashp.mul(tj);
			let p4 = hashSP.mul(cj);
			b = p3.add(p4);

			ctlist.push(cj);
			ctlist.push(tj);

			csum = csum.add(cj);
		}

		if (j == N_signer) {
			let zero = new BigInteger.BNCLASS(0, 16, "be");
			ctlist.push(zero);
			ctlist.push(zero);
			
			// [TEMP] [FIXME] GENERATE RANDOM ri!!
			let data = secureRandom(32, {type: 'Buffer'});                                                                    
			let ri = new BN(data, 16, "be");       
			a = gen.mul(ri);
			b = hashp.mul(ri);
		}

		hash_acc = ethereumjs_util.sha256(Buffer.concat([hash_acc, a.serialize(true), b.serialize(true)]));
	}

	// [TODO] remove unneeded "umods"
	let hashb = new BN(hash_acc, 16, "be");
	hashb = hashb.umod(order);
	
	csum = csum.umod(order);

	let c = new BN(hashb, 16, "be");
	c = c.sub(csum).umod(order);
	
	let cx = new BN(c, 16, "be");
	cx = cx.mul(pk);
	cx = cx.umod(order);

	let ti = new BN(ri, 16, "be");
	ti = ti.sub(cx);
	ti = ti.umod(order);

	ctlist[2 * N_signer] = c;
	ctlist[2 * N_signer + 1] = ti;

	let x = "0x" + hashSP.serialize(true).slice(0,32).toString('hex');
	let y = "0x" + hashSP.serialize(true).slice(32,64).toString('hex');

	let ctlist_hex = []
	for (let i =0; i < ctlist.length; i++) {
		ctlist_hex[i] = "0x" + ctlist[i].toString('hex');
	}
	return { "tau": {'x': x, 'y': y }, "ctlist": ctlist_hex };
  }

  it("curve test", async function () {
	let message = "0x14462573adecc6b213bfd0290aea56d908c2b491d3a26b1e35febceb9153c784";

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
      Math.round(new Date/1000) + 60,
      {from: roles.owner}
    );

	let ringdata0 = {
		  "pubkeys": [
			{
			  "x": "0x26db77bfb9f8a2876266d5302eb034769fdde10049b6849abb9f77592ccfb91d",
			  "y": "0x1e40a7be578811ce812589748470effdb7f0185338ce63adcc2bf94f94c5180f"
			},
			{
			  "x": "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf",
			  "y": "0x9ff14963bc007efecf73247b0e458dd2cac4ec2a7aa11a13a87b90843be5969"
			},
			{
			  "x": "0x5506a71b93730e9f8abc99b0ef8e2940fdfdfd2a6c3892bb3a5f47c4634e31c",
			  "y": "0x163ec7c4820c2234c35c4b309573367def35441d8e14b7fd2a29f2e4cd19b12a"
			}
		  ],
		  "privkey": "0x16557fa436d7336e6e23092e4b4bc403bed70991044523338269a146257a0250",
		  "privkeyindex" : 0
	};

	let ringdata1 = {
		  "pubkeys": [
			{
			  "x": "0x26db77bfb9f8a2876266d5302eb034769fdde10049b6849abb9f77592ccfb91d",
			  "y": "0x1e40a7be578811ce812589748470effdb7f0185338ce63adcc2bf94f94c5180f"
			},
			{
			  "x": "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf",
			  "y": "0x9ff14963bc007efecf73247b0e458dd2cac4ec2a7aa11a13a87b90843be5969"
			},
			{
			  "x": "0x5506a71b93730e9f8abc99b0ef8e2940fdfdfd2a6c3892bb3a5f47c4634e31c",
			  "y": "0x163ec7c4820c2234c35c4b309573367def35441d8e14b7fd2a29f2e4cd19b12a"
			}
		  ],
		  "privkey": "0x29af60404e8a85a51dad7bf906e76d632e662c66e6b614b591ec87e378eeb8d4",
		  "privkeyindex" : 1
		};

	    let indexes = await jury.getJudgmentsIndexes();
    	let index0 = indexes[0];

		let sign0 = getRingSignature(message, ringdata0);
		//await l(sign0);
		//let sign1 = getRingSignature(message, ringdata1);
		//await l(sign1);

		let judg;
		
		// await jury.guilty(index0, [sign0.tau.x, sign0.tau.y], sign0.ctlist)
		//judg = await jury.getJudgment(index0)
		//assert.equal(false, judg[4]) //guilty
		//assert.equal(1, judg[5].toString()) //count

 		//await jury.guilty(index0, [sign1.tau.x, sign1.tau.y], sign1.ctlist)
    	//judg = await jury.getJudgment(index0)
    	//assert.equal(true, judg[4]) //guilty
    	//assert.equal(2, judg[5].toString()) //count


  });


  it("complex test", async function () {

  	await jury.add(
      'Do smth123',
      [
        "0x26db77bfb9f8a2876266d5302eb034769fdde10049b6849abb9f77592ccfb91d",
        "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf"
      ],
      [
        "0x1e40a7be578811ce812589748470effdb7f0185338ce63adcc2bf94f94c5180f",
        "0x9ff14963bc007efecf73247b0e458dd2cac4ec2a7aa11a13a87b90843be5969"
      ],
      2,
      Math.round(new Date/1000) + 60,
      {from: roles.owner}
    );

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
      Math.round(new Date/1000) + 60,
      {from: roles.owner}
    );

    let indexes = await jury.getJudgmentsIndexes();
    let index0 = indexes[1];

    assert.equal(
      'Do smth',
      (await jury.getJudgment(index0))[0]
    );
    assert.equal(
      "0x17697e6b2be2c0a6a169f12105d35021cedcaf4784f178c4a1f9d7a14f22b4cf",
      web3.toHex((await jury.getJudgment(index0))[1][1])
    );
    //l((await jury.getJudgment(index0))[6])
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

    await jury.guilty(index0, [sign0.tau.x, sign0.tau.y], sign0.ctlist)
    judg = await jury.getJudgment(index0)
    assert.equal(false, judg[4]) //guilty
    assert.equal(1, judg[5].toString()) //count

    await jury.guilty(index0, [sign1.tau.x, sign1.tau.y], sign1.ctlist)
    judg = await jury.getJudgment(index0)
    assert.equal(true, judg[4]) //guilty
    assert.equal(2, judg[5].toString()) //count

  });

});
