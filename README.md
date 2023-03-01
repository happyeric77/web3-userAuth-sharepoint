# Use crypto wallet and microsoft Microsoft Azure to create a password-less secured website (web2.5)

![](https://i.imgur.com/JHZ0ibc.png)

The project is built on top of

1. [evm web3 dapp boilerplate](https://github.com/happyeric77/evm-dapp-boilerplate-ts.git)
2. [Microsoft Graph api auth package](https://www.npmjs.com/package/ms365-graph-api-auth)
3. [evm web3 react hook](https://www.npmjs.com/package/evm-web3-hooks)

Check the tutorial video [here](https://youtu.be/e_q9b8sTID8)

# How to use

1. clone the repo:

```
git clone TODO
```

2. install npm dependencies and generate types (Option: if you have smart contract JSON ABI files to update)

```
yarn install

yarn generate-types // Generate a new folder `contractTypes` which contains all the contracts types definition. The types are generated from /utils/contracts/*.json (compiled by truffle)
```

3. Register an Azure app, check the tutorial video [here](https://youtu.be/sXW3G8gtlWs)

4. change the ".env.example" filename to ".env" and fill in the corresponding credential.

5. Run and listen on localhost port 3000

```
yarn dev
```
