const { Wallet, SecretNetworkClient } = require("secretjs");

const fs = require("fs");

// Load environment variables
require("dotenv").config();

const setup = async () => {
  // Import wallet from mnemonic phrase
  // Use key created in tutorial #2
  const wallet = new Wallet(process.env.MNEMONIC_1);

  // Create a connection to Secret Network node
  // Pass in a wallet that can sign transactions
  // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
  const secretjs = new SecretNetworkClient({
    url: process.env.SECRET_LCD_URL,
    wallet: wallet,
    walletAddress: wallet.address,
    chainId: process.env.SECRET_CHAIN_ID,
  });
  console.log(`Wallet address=${wallet.address}`);

  // Upload the wasm of a simple contract
  // const wasm = fs.readFileSync("5_contracts/contract.wasm");
  // console.log("Uploading contract");

  // let tx = await secretjs.tx.compute.storeCode(
  //   {
  //     sender: wallet.address,
  //     wasm_byte_code: wasm,
  //     source: "",
  //     builder: "",
  //   },
  //   {
  //     gasLimit: 1_000_000,
  //   }
  // );

  // const codeId = Number(
  //   tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
  //     .value
  // );
  const codeId = 1;
  console.log("codeId: ", codeId);

  // contract hash, useful for contract composition
  const contractCodeHash = (await secretjs.query.compute.codeHashByCodeId({code_id: codeId})).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);

  // Create an instance of the Counter contract, providing a starting count
  const initMsg = { };
  tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "TEE-OffChain-Token-" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 100_000,
    }
  );

  console.log(`instatiate tx=${tx.code} ${tx.rawLog}`);
  
  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  console.log(`contractAddress=${contractAddress}`);

  return [codeId, contractAddress, contractCodeHash];
};

const deposit = async (wallet, contractInfo) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    console.log(`Wallet address=${wallet.address}`);
  
    console.log("codeId: ", codeId);
      // contract hash, useful for contract composition
    console.log(`Contract hash: ${contractCodeHash}`);
    console.log(`contractAddress=${contractAddress}`);
  
    // Sending deposit request
    console.log(`Wallet address=${wallet.address} Sending deposit 100`);
  
    tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {SubmitDeposit: {}},
        sentFunds: [{ amount: "100", denom: "uscrt" }], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
  
};

const withdraw = async (wallet, contractInfo) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    // console.log(`Wallet address=${wallet.address}`);
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);
  
    // Sending withdraw request
    console.log(`Wallet address=${wallet.address} Sending withdraw`);
  
    tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {SubmitWithdraw: {amount: 50}},
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
  
};

const transfer = async (wallet, contractInfo, receiverAddr) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    // console.log(`Wallet address=${wallet.address}`);
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);
  
    // Sending transfer request
    console.log(`Wallet address=${wallet.address} Sending transfer`);
  
    tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {SubmitTransfer: {to: receiverAddr, memo: "", amount: 50}},
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
  
};

const balance = async (wallet, contractInfo, viewingKey) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    // console.log(`Wallet address=${wallet.address}`);
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);

  // Query balance
  console.log("Querying contract for balance");
  const balance = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractCodeHash,
    query: { get_balance: {address: wallet.address, key: viewingKey} },
  });

  console.log(`Wallet address=${wallet.address} balance=${balance}`);

  
};

const setupViewingKey = async (wallet, contractInfo) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    // console.log(`Wallet address=${wallet.address}`);
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);
  
    // Creating viewingKey
    console.log(`Wallet address=${wallet.address} Creating viewingKey`);
  
    tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {CreateViewingKey: {entropy: wallet.address + "entropy"}},
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    viewingKey = tx.data[0];

    console.log(`Wallet address=${wallet.address} viewingKey ${viewingKey}`);

    // Creating viewingKey
    console.log(`Wallet address=${wallet.address} Set viewingKey`);

    tx = await secretjs.tx.compute.executeContract(
        {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {SetViewingKey: {key: viewingKey}},
        sentFunds: [], // optional
        },
        {
        gasLimit: 100_000,
        }
    );

    return viewingKey;
  
};


const getState = async (wallet, contractInfo) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    // console.log(`Wallet address=${wallet.address}`);
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);

  // Query balance
  console.log("Querying contract for contract state");
  const state = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractCodeHash,
    query: { GetState: {} },
  });

  return state;  
};

const processNext = async (wallet, contractInfo, inState) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
    // console.log(`Wallet address=${wallet.address}`);
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);

  // Query balance
  console.log("Querying contract for process next");
  const outState = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractCodeHash,
    query: { ProcessNext: {cipher: inState} },
  });

  return outState;  
};

const commitState = async (wallet, contractInfo, inState) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);
  
    // Sending commit 
    console.log(`Sending commit`);
  
    tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {CommitResponse: {cipher: inState}},
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
  
};

const writeCheckpoint = async (wallet, contractInfo, inState) => {
    codeId = contractInfo[0];
    contractAddress = contractInfo[1];
    contractCodeHash = contractInfo[2];
    // Create a connection to Secret Network node
    // Pass in a wallet that can sign transactions
    // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
    const secretjs = new SecretNetworkClient({
      url: process.env.SECRET_LCD_URL,
      wallet: wallet,
      walletAddress: wallet.address,
      chainId: process.env.SECRET_CHAIN_ID,
    });
  
    // console.log("codeId: ", codeId);
    //   // contract hash, useful for contract composition
    // console.log(`Contract hash: ${contractCodeHash}`);
    // console.log(`contractAddress=${contractAddress}`);
  
    // Sending write checkpoint
    console.log(`Sending write checkpoint`);
  
    tx = await secretjs.tx.compute.executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        code_hash: contractCodeHash, // optional but way faster
        msg: {WriteCheckpoint: {cipher: inState}},
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
  
};

const wallet_worker = new Wallet(process.env.MNEMONIC_1);
// const wallet_2 = new Wallet(process.env.MNEMONIC_2);
// const wallet_3 = new Wallet(process.env.MNEMONIC_3);


setup().then((contractInfo) => {

  // deposit(wallet_2, contractInfo).then(() => {
  //   setupViewingKey(wallet_2, contractInfo).then((vk_2) => {
  //     balance(wallet_2, contractInfo, vk_2);
  
  //     }).catch((reason) => {
  //       // do something when the promise is rejected
  //       console.log("error in vk", reason);
  //     });
  //   }).catch((reason) => {
  //     console.log("error in deposit", reason);
  //     // do something when the promise is rejected
  //   });
  }).catch((reason) => {
    console.log("error in setup", reason);
});

/*

const contractInfo = await setup();
console.log("contractInfo: ", contractInfo);

//Deposit 100 into wallet 2 to wallet 3
await deposit(wallet_2, contractInfo);
deposit(wallet_3, contractInfo);

vk_2 = setupViewingKey(wallet_2);
vk_3 = setupViewingKey(wallet_3);

balance(wallet_2, contractInfo, vk_2);
balance(wallet_3, contractInfo, vk_3);

state_0 = getState(wallet_worker, contractInfo);
state_1 = processNext(wallet_worker, contractInfo, state_0);
state_2 = processNext(wallet_worker, contractInfo, state_1.checkpoint_cipher);
commitState(wallet_worker, contractInfo, state_1.request_cipher);
commitState(wallet_worker, contractInfo, state_2.request_cipher);
writeCheckpoint(wallet_worker, contractInfo, state_2.checkpoint_cipher);

balance(wallet_2, contractInfo, vk_2);
balance(wallet_3, contractInfo, vk_3);

//Transfer 50 from wallet 2 to wallet 3
transfer(wallet_2, contractInfo, wallet_3.address);


state_3 = getState(wallet_worker, contractInfo);
state_4 = processNext(wallet_worker, contractInfo, state_3);
commitState(wallet_worker, contractInfo, state_4.request_cipher);
writeCheckpoint(wallet_worker, contractInfo, state_4.checkpoint_cipher);

balance(wallet_2, contractInfo, vk_2);
balance(wallet_3, contractInfo, vk_3);


//Withdraw 50 from wallet 2 and wallet 3
withdraw(wallet_2, contractInfo);
withdraw(wallet_3, contractInfo);

state_5 = getState(wallet_worker, contractInfo);
state_6 = processNext(wallet_worker, contractInfo, state_5);
state_7 = processNext(wallet_worker, contractInfo, state_6.checkpoint_cipher);
commitState(wallet_worker, contractInfo, state_7.request_cipher);
commitState(wallet_worker, contractInfo, state_6.request_cipher);
writeCheckpoint(wallet_worker, contractInfo, state_7.checkpoint_cipher);

balance(wallet_2, contractInfo, vk_2);
balance(wallet_3, contractInfo, vk_3);



*/