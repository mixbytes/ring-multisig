# Ring Signatures based anonymous voting
## (Barreto-Naehrig 256 bit Elliplic Curve)
[Presentation in Google Slides](https://docs.google.com/presentation/d/17zCLXaHwzHTcYjjKMqEyFRZMnqpjynqsoTjk5YdQ7Yk)

[Live demo](https://ring-multisig.mixbytes.io/)
[Contract in testnet](https://rinkeby.etherscan.io/address/0x2e8aed5091f347c51976e28c00874a1cdde461a1#code)

### User story:
Roles: judge (voting initiator), juries.

1. Judge publishes a decision on some topic, f.e "Death sentence hearing on case #01232"
2. Judge publishes M public keys of juries and number N: N <= M - amount of needed votes "for"
3. Each jury:
    - generates message, voting "for" judge's decision. Voting "against" is passive (just do nothing)
    - generates ring-signature for this message, using public keys of other juries (under the hood)
    - sends transaction with ring-signature to contract
4. Contract collects each correct signature, and increases number of votes "for" if all ok
5. If N votes "for" is reached, action is performed

It's planned to implement this ring-signing as a library, to use with any solidity function

## Elevator Pitch
Solidity library to make any solidity function wrapped in "ring-multisig" voting, using 'bn256' curve (well designed for anonimous voting). Ring-signatures now used mostly for mixing ether and tokens, but we want to show the possibility to use ring-signatures to other important human activities.

As an example we've made the DApp to anonymously vote on critical decisions (euthanasia, death senstence, etc.) using BN256 ellicptic curve. Such solutions are also useful for voting in DAOs and any other places, that require collective decisions without revealing voters' identities. Also, we plan to use this library for our own contract constructors.

Another way to implement anonimous multisig capabilities is zkS[NT]ARKs-based voting and some other secret sharing schemes. We'll try them in future works.
      
## Inspiration
We want to solve problem of critical decision making and unability to gurantee privacy of those collective decisions (for examples decisions of juries). Also, we want to give developers an easy way to implement ring-signature-based voting on arbitrary action in Ethereum contracts, using simple configuration procedure.

## What it does
It allows any Solidity developer simply add anonymous voting ("N-of-M" votes "for") for any contract action(like multisig, but anonymous). The example DApp allows judge to create a new proposal and nominate juries who in turn can cast votes using their respective private keys. Judge specifies criteria for decision to be enforced (N of M signatures). 
Juries cast their votes that are counted by smart contract preserving full privacy.

## How we built it
We've taken two implementaions, Solidity part from Mobius project and JS implementation from BulletproofJS made by Alex Vlasov and tried to connect them. The result is solidity function modifier, allowing set N of M linked ring signatures required for action to be performed in contract. At the end of hackathon we still have problems in signing, but the 99% of algorythm is checked and we're sure, that it will be fixed in next few days of work.

## Challenges we ran into
There is no ready implementation on ring signatures using bn256 curve, usable with Solidity and JS, so, you cannot simply use ring-signatures for anonmous voting in Ethereum DApps, so, the challenge was to make this heterogenous code to work.

## Accomplishments that we're proud of
Elliptic curves cryptography implementation in JS. Usage of ring-signatures not only to build mixers for tokens and ether.

## What I learned
The new curves, designed for anonymous voting, low-level programming in Javascript (OMG) 

## What's next for Ring Signatures Anonymous Voting
Finally fix the signing algorythm (at the end of hackathon we still have problems in signing, but the 99% of algorythm is checked and we're sure, that it will be fixed in next few days of work). Publish final universal solution (JS component and Solidity library) to use by ane Solidity developer, wishing to add anonimous voting for any contract action.

## Library
Project above is only a demo. The main idea is to implement a library for protecting any function of any contract with anonymous multisignature.

### Usage
- Install lib via npm: `npm install ring-multisig`
- Initialize [Single ring](https://github.com/mixbytes/ring-multisig/blob/master/contracts/usage_examples/Single.sol#L22) or [multiple rings](https://github.com/mixbytes/ring-multisig/blob/master/contracts/usage_examples/Jury.sol#L113)
- Use modifier [ringMultisigned](https://github.com/mixbytes/ring-multisig/blob/master/contracts/RingMultisig.sol#L37) for any function ([example](https://github.com/mixbytes/ring-multisig/blob/master/contracts/usage_examples/Single.sol#L78)). It will be executed only after `threshold` calls with ring signatures
