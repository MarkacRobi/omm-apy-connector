console.log("showcase script loaded..")


// get OMM token distribution per day
ommApyConnector.getTokenDistributionForDay().then(res => {
    console.log("getTokenDistributionForDay: " + res);
})

// get Supply APY for USDS
ommApyConnector.getSupplyApyForReserve("USDS").then(res => {
    console.log("getSupplyApyForReserve: " + res);
})

// get USDS Supply OMM rewards APY (formula from meeting minutes)
ommApyConnector.supplyOmmRewardsApy("USDS").then(res => {
    console.log("USDS Supply OMM rewards APY: " + res);
})

// get USDS borrow APY (formula from meeting minutes)
ommApyConnector.borrowOmmRewardsApy("USDS").then(res => {
    console.log("USDS borrow OMM rewards APY: " + res);
})


