# Ring Signatures based anonymous voting
## (Barreto-Naehrig 256 bit Elliplic Curve)
[Presentation in Google Slides](https://docs.google.com/presentation/d/17zCLXaHwzHTcYjjKMqEyFRZMnqpjynqsoTjk5YdQ7Yk)


### User story:
- Roles: judge, juries

1. Judge publishes a decision on some topic, f.e "Death sentence hearing on case #01232"
2. Judge publishes M public keys of juries and number N: N <= M - amount of needed votes "for"
3. Each jury:
    - generates message, voting "for" or "against" judge's decision
    - generates ring-signature for this message, using public keys of other juries
    - sends transaction with ring-signature to contract
4. Contract collects each correct signature, and increases number of votes "for" if all ok
5. If N votes "for" is reached, action is performed

It's planned to implement this ring-signing as a library, to use with any solidity function

## Elevator Pitch
dApp to anonymously vote on critical decisions (euthanasia, death senstence, etc.) using BN256 ellicptic curve

## Inspiration
We want to solve problem of critical decision making and unability to gurantee privacy of those collective decisions.

## What it does
dApp allows judge to create a new proposal and nominate juries who in turn can cast votes using their respective private keys.
Prosopal creator specifies criteria for decision to be enforced (N of M signatures).
Juries cast their votes that are counted by smart contract preserving full privacy.

## How I built it
## Challenges I ran into
## Accomplishments that I'm proud of
## What I learned
## What's next for Ring Signatures Anonymous Voting
