npx hardhat \
    --network localhost \
    deploy_round_factory \
    --math $(cat vars/math_address) \
    > vars/round_factory_address