# Ring-multisig

## Ring signature based voting for ETH Berlin hackathon
- Roles: judge, juries
### User story:

1. Judge publishes a decision on some topic, f.e "Ivan is guilty!"
2. Judge publishes M public keys of juries and number N: N <= M - amount of needed votes "for"
3. Each jury:
    - generates message, voting "for" or "against" judge's decision
    - generates ring-signature for this message, using public keys of other juries
    - sends transaction with ring-signature to contract
4. Contract collects each correct signature, and increases number of votes "for" if all ok
5. If N votes "for" is reached, action is performed

It's planned to implement this ring-signing as a library, to use with any solidity function
