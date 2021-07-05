npx hardhat \
    --network localhost \
    deploy_controller \
    --roundfactory $(cat vars/round_factory_address) \
    --math $(cat vars/math_address) \
    > vars/controller_address