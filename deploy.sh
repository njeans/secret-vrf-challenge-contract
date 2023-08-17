set -x
set -e


# docker run --rm -it -d -p 9091:9091 -p 26657:26657 -p 1317:1317 -p 5000:5000 \
  # --name localsecret ghcr.io/scrtlabs/localsecret:latest


# make build
# make store-contract-local

secretcli config node http://localhost:26657
secretcli config chain-id secretdev-1
secretcli config keyring-backend test
secretcli config output json


MNEMONIC_1="fabric toe special change advice december shiver recall shoe jar glide catalog skin october vehicle physical increase lyrics quote name fine border portion fancy"
ADDRESS_1='secret1ld9ak4qfn2t2fg3x3yz59lu7rg7tpw7gae7gqj'
MNEMONIC_2='merge coast limb solution body truck push oppose black excess inflict electric assume rescue mean project rice pig liar table siege magic silk slush'
ADDRESS_2="secret1a57rwyazlu09vvcsh5602jchmfhaxnrs2rq0yu"
ADDRESS_3='secret1tah2fd6cltk8e70epdzv9d9mrre6qypsd8gcjx'
MNEMONIC_3="first wood anchor sick decrease kitten wall fossil logic injury tuition cinnamon drill camera mother text oxygen filter hurt slender ostrich surface shell soldier"


eval TXHASH_1=$(curl http://localhost:5000/faucet?address=$ADDRESS_1 | jq .txhash )
sleep 5
secretcli q tx $TXHASH_1 | jq .code
secretcli query bank balances $ADDRESS_1 | jq .

eval TXHASH_2=$(curl http://localhost:5000/faucet?address=$ADDRESS_2 | jq .txhash )
sleep 5
secretcli q tx $TXHASH_2 | jq .code
secretcli query bank balances $ADDRESS_2 | jq .

eval TXHASH_3=$(curl http://localhost:5000/faucet?address=$ADDRESS_3 | jq .txhash )
sleep 5
secretcli q tx $TXHASH_3 | jq .code
secretcli query bank balances $ADDRESS_3 | jq .

exit 0

MNEMONIC_1="pet detect neck spin police roast wise cherry nothing spawn rural trash subject change harbor flat behind anger force reward drink code antenna rare"
echo $MNEMONIC_1 | secretcli keys add acc1 --recover
eval ADDR_1=$(secretcli keys show acc1 | jq .address)
sleep 2
secretcli q tx $TXHASH | jq .code
secretcli query bank balances $ADDR_1 
eval TXHASH=$(secretcli tx compute store artifacts/contract.wasm.gz -y --gas 5000000 --from $ADDR_1 --chain-id secretdev-1 | jq .txhash)
sleep 2
secretcli q tx $TXHASH | jq .code
exit 0


MNEMONIC_2="pet detect neck spin police roast wise cherry nothing spawn rural trash subject change harbor flat behind anger force reward drink code antenna rare"
MNEMONIC_3="merge coast limb solution body truck push oppose black excess inflict electric assume rescue mean project rice pig liar table siege magic silk slush"


echo $MNEMONIC_2 | secretd keys add acc2 --recover
echo $MNEMONIC_3 | secretd keys add acc3 --recover
eval ADDR_2=$(secretcli keys show acc2 | jq .address)
eval ADDR_3=$(secretcli keys show acc3 | jq .address)



eval TXHASH=$(curl http://localhost:5000/faucet?address=$ADDR_2 | jq .txhash )
secretcli q tx $TXHASH | jq .code

eval TXHASH=$(curl http://localhost:5000/faucet?address=$ADDR_3 | jq .txhash )
secretcli q tx $TXHASH | jq .code

secretcli query bank balances $ADDR_2 
secretcli query bank balances $ADDR_3 
