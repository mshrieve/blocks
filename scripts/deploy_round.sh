npx hardhat \
    --network localhost \
    deploy_round \
    --controller $(cat vars/controller_address) \
    --usdc $(cat vars/usdc_address) \
    --aggregator $(cat vars/aggregator_address) \
    > vars/round_address