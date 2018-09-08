'use strict';
import {sha3, bufferToHex} from 'ethereumjs-util';
import MerkleTree from '../test/helpers/merkleTree';
import expectThrow from '../test/helpers/expectThrow';

//new Web3.providers.HttpProvider('http://localhost:8545'));

let Web3 = require('web3');
let web3 = new Web3('http://localhost:9545');

import {BigNumber} from 'bignumber';
const ethereumjsWallet = require('ethereumjs-wallet')

const RingMultisig = artifacts.require("RingMultisig.sol");

const l = console.log;

contract('RingMultisig', function(accounts) {

	function get_pseudo_rand(seed) {
		return "0x0000000000000000000000000000000000000042"; // returns absolutely random value :)
	}


    it("complex test", async function() {
		let pks = ['c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', '0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1'];
		
    	let user0 = ethereumjsWallet.fromPrivateKey(Buffer.from(pks[0], "hex"));
		let user0Address = "0x" + user0.getAddress().toString("hex");
		let user0PublicKey = "0x" + user0.getPublicKey().toString("hex");

    	let user1 = ethereumjsWallet.fromPrivateKey(Buffer.from(pks[1], "hex"));
		let user1Address = "0x" + user1.getAddress().toString("hex");
		let user1PublicKey = "0x" + user1.getPublicKey().toString("hex");

    	let user2 = ethereumjsWallet.fromPrivateKey(Buffer.from(pks[2], "hex"));
		let user2Address = "0x" + user2.getAddress().toString("hex");
		let user2PublicKey = "0x" + user2.getPublicKey().toString("hex");
		

		// let user0 = await web3.eth.accounts.create('user0xoxo');
		// let user1 = await web3.eth.accounts.create('user1xoxo');
		// let user2 = await web3.eth.accounts.create('user2xoxo');

		await web3.eth.sendTransaction({from: accounts[0], to: user0Address, value: web3.utils.toWei('1000', 'finney') });
		await web3.eth.sendTransaction({from: accounts[0], to: user1Address, value: web3.utils.toWei('2000', 'finney') });
		await web3.eth.sendTransaction({from: accounts[0], to: user2Address, value: web3.utils.toWei('3000', 'finney') });

		const ring = await RingMultisig.new();
		let res = await ring.DepositN([user0Address, user1Address, user2Address], {from: user0Address, value: web3.utils.toWei('666', "finney")});
		//let bal = await ring.getTokenBalance(user0Address);

		let pub1 = user0.getPublicKey()
		let pub1_1 = pub1.slice(0, 32).toString('hex');
		let pub1_2 = pub1.slice(32, 64).toString('hex');
		let compressed_pub1 = await ring.CompressPoint(['0x' + pub1_1, '0x' + pub1_2]);

		let pub2 = user0.getPublicKey()
		let pub2_1 = pub2.slice(0, 32).toString('hex');
		let pub2_2 = pub2.slice(32, 64).toString('hex');
		let compressed_pub2 = await ring.CompressPoint(['0x' + pub2_1, '0x' + pub2_2]);

		let pub3 = user0.getPublicKey()
		let pub3_1 = pub3.slice(0, 32).toString('hex');
		let pub3_2 = pub3.slice(32, 64).toString('hex');
		let compressed_pub3 = await ring.CompressPoint(['0x' + pub3_1, '0x' + pub3_2]);

		let message = "guilty_yes";
		let res2 = await ring.sign(message,
											[  "0x0000000000000000000000000000000000000000", // index(0 .. N-1), chows which pubkey is owned by real signer
												"0x" + user0.getPrivateKey().toString("hex"), // Private key of real signer
												get_pseudo_rand(0),
												get_pseudo_rand(1),
												get_pseudo_rand(2),
												compressed_pub1,
												compressed_pub2,
												compressed_pub3,
											],
											{ from: user0Address });
		let res3 = await ring.verify(message
												res2,
											{ from: user0Address });
		assert(false);
		// await l(res3);

			
    });

});
