console.log("showcase script loaded..")


// get OMM token distribution per day
ommApyConnector.getTokenDistributionForDay().then(res => {
    console.log("getTokenDistributionForDay: " + res);
})

// get Supply APY for USDb
ommApyConnector.getSupplyApyForReserve("USDB").then(res => {
    console.log("getSupplyApyForReserve: " + res);
})

// get USDb Supply OMM rewards APY (formula from meeting minutes)
ommApyConnector.USDbSupplyOmmRewardsApy().then(res => {
    console.log("USDb Supply OMM rewards APY: " + res);
})

// get USDb borrow APY (formula from meeting minutes)
ommApyConnector.USDbBorrowApy().then(res => {
    console.log("USDb borrow APY: " + res);
})
