import {hexToNormalisedNumber, icxValueToNormalValue} from "./utils";
import {AllAddresses} from "./models/AllAddresses";
import {ScoreMethodNames} from "./models/ScoreMethodNames";
import {AllReservesData, ReserveData} from "./models/AllReservesData";
import {Mapper} from "./mapper";
import {AssetTag} from "./models/Asset";
import {Formulas} from "./Formulas";

const IconService = require("icon-sdk-js");
const {IconBuilder, IconAmount, IconConverter} = IconService;
const { CallBuilder, CallTransactionBuilder, IcxTransactionBuilder,  } = IconBuilder;

console.log("OmmApyConnector loaded..")

export class OmmApyConnector {
    /**
     * Constants setup
     */
    private iconRpcUrl  = "https://bicon.net.solidwallet.io/api/v3" // testnet
    private httpProvider = new IconService.HttpProvider(this.iconRpcUrl);
    private iconService = new IconService(this.httpProvider);
    private addressProviderScore = "cx77497caa623b73bb492942081eb809f824b9c82a"

    /**
     * Variables holding useful data
     */
    public allScoreAddresses?: AllAddresses;
    public allReservesData?: AllReservesData;
    public tokenDistributionPerDay?: number;

    /**
     * Get reserve data for USDS reserve
     */
    public async getUSDbReserveData(): Promise<ReserveData> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(AssetTag.USDS));
    }

    /**
     * Initialize all SCORE addresses. Those addresses are needed for other calls.
     */
    public async loadAllAddresses(): Promise<void> {
        await this.getAllScoreAddresses()
            .then(allScoreAddresses => {
                this.allScoreAddresses = new AllAddresses(allScoreAddresses.collateral, allScoreAddresses.oTokens, allScoreAddresses.systemContract);
            })
            .catch(e => {
                console.error(e);
                throw e;
        });
    }

    /**
     * @description Retrieve supply APY (liquidity rate) for specific asset tag.
     * @param {AssetTag} assetTag - Tag of the asset we want tot retrieve APY for (USDS, ICX or IUSDC).
     * @return {number} Reserve APY (liquidity rate).
     */
    public async getSupplyApyForReserve(assetTag: AssetTag): Promise<number> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(assetTag))
            .then(reserveData => reserveData.getSupplyApy());
    }

    /**
     * @description Retrieve borrow APY (borrow rate) for specific asset tag.
     * @param {AssetTag} assetTag - Tag of the asset we want tot retrieve APY for (USDS, ICX or IUSDC).
     * @return {number} Reserve APY (liquidity rate).
     */
    public async getBorrowApyForReserve(assetTag: AssetTag): Promise<number> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(assetTag))
            .then(reserveData => reserveData.getBorrowApy());
    }

    /**
     * @description Retrieve ICX balance for address
     * @param {string} address - Icon address.
     * @return {number} ICX balance
     */
    public async getIcxBalance(address: string): Promise<number> {
        const icxBalance = await this.iconService.getBalance(address).execute();
        return icxValueToNormalValue(icxBalance);
    }

    /**
     * @description Retrieve supply APY (including OMM rewards) for specific reserve.
     * @param {AssetTag} assetTag - Tag of the asset we want tot retrieve APY for (USDS, ICX or IUSDC).
     * @return {number} APY.
     */
    public async supplyOmmRewardsApy(assetTag: AssetTag): Promise<number> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(assetTag)).then(async reserveData => {
            const liquidityRate = reserveData.liquidityRate;

            if (!this.tokenDistributionPerDay) {
                await this.loadTokenDistributionForDay()
            }

            const totalInterestOverAYear = await this.supplyTotalInterestOverAYear();

            return Formulas.supplyOmmApyFormula(liquidityRate, totalInterestOverAYear, this.tokenDistributionPerDay!, 2)
        });
    }

    /**
     * @description Retrieve borrow APY (including OMM rewards) for specific reserve.
     * @param {AssetTag} assetTag - Tag of the asset we want tot retrieve APY for (USDS, ICX or IUSDC).
     * @return {number} APY.
     */
    public async borrowOmmRewardsApy(assetTag: AssetTag): Promise<number> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(assetTag)).then(async reserveData => {
            const borrowRate = reserveData.borrowRate;

            if (!this.tokenDistributionPerDay) {
                await this.loadTokenDistributionForDay()
            }

            const totalInterestOverAYear = await this.borrowTotalInterestOverAYear();

            return Formulas.borrowOmmApyFormula(borrowRate, totalInterestOverAYear, this.tokenDistributionPerDay!, 2)
        });
    }


    /**
     * @description Get all SCORE addresses (collateral, oTokens, System Contract, ..)
     * @return  {AllAddresses}
     */
    public async getAllScoreAddresses(): Promise<AllAddresses> {
        const tx = this.buildReadTransaction(this.addressProviderScore,
            ScoreMethodNames.GET_ALL_ADDRESSES, {});
        return this.iconService.call(tx).execute();
    }

    /**
     * @description Get reserve data for a specific reserve
     * @param reserve - Address from allScoreAddresses variable
     * @return {ReserveData}
     */
    public async getSpecificReserveData(reserve: string): Promise<ReserveData> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        const tx = this.buildReadTransaction(this.allScoreAddresses!.systemContract.LendingPoolDataProvider,
            ScoreMethodNames.GET_SPECIFIC_RESERVE_DATA, { _reserve: reserve });

        const res = await this.iconService.call(tx).execute();

        return Mapper.mapReserveData(res);
    }

    /**
     * @description Get reserve data for all reserves
     * @return {AllReservesData}
     */
    public async getAllReserveData(): Promise<AllReservesData> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        const tx = this.buildReadTransaction( this.allScoreAddresses!.systemContract.LendingPoolDataProvider,
            ScoreMethodNames.GET_ALL_RESERVE_DATA, {});

        const allReserves = await this.iconService.call(tx).execute();

        const newAllReserve = new AllReservesData(allReserves.USDS, allReserves.ICX, allReserves.USDC);
        Object.entries(newAllReserve).forEach((value: [string, ReserveData]) => {
            // @ts-ignore
            newAllReserve[value[0]] = Mapper.mapReserveData(value[1]);
        });

        return newAllReserve;
    }

    /**
     * @description Get OMM token distribution for a day
     * @return {Number}
     */
    private async getTokenDistributionForDay(): Promise<number> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        const params = {
            _day: "0x1",
        };

        const tx = this.buildReadTransaction(this.allScoreAddresses!.systemContract.Rewards,
            ScoreMethodNames.GET_TOKEN_DISTRIBUTION_PER_DAY, params);

        return hexToNormalisedNumber(await this.iconService.call(tx).execute());
    }

    /**
     * @description sum(sum(CollateralBalanceUSD * liquidityRate)) for all users
     * @return {Number}
     */
    public async supplyTotalInterestOverAYear(): Promise<number> {
        if (!this.allReservesData) {
            await this.loadAllReservesData();
        }

        let allUsersCollateralSumRate = 0;
        Object.values(this.allReservesData!).forEach((reserve: ReserveData) => {
            allUsersCollateralSumRate += reserve.totalLiquidityUSD * reserve.liquidityRate;
        });

        return allUsersCollateralSumRate
    }

    /**
     * @description formula = sum(sum(BorrowBalanceUSD *borrowRate))
     * @return {Number}
     */
    public async borrowTotalInterestOverAYear(): Promise<number> {
        if (!this.allReservesData) {
            await this.loadAllReservesData();
        }

        let allUsersBorrowSumRate = 0;
        Object.values(this.allReservesData!).forEach((reserve: ReserveData) => {
            allUsersBorrowSumRate += reserve.totalBorrowsUSD * reserve.borrowRate;
        });

        return allUsersBorrowSumRate
    }


    public async loadTokenDistributionForDay(): Promise<void> {
        await this.getTokenDistributionForDay()
            .then(res => this.tokenDistributionPerDay = res);
    }

    public async loadAllReservesData(): Promise<void> {
        await this.getAllReserveData()
            .then(res => this.allReservesData = res);
    }

    private buildReadTransaction(to: string, method: string, params: any): any {
        /* Build `Call` instance for calling external i.e. read methods . */
        return new CallBuilder()
            .to(to)
            .method(method)
            .params(params)
            .build();
    }
}

// Export an instance of the class directly
let ommApyConnector: OmmApyConnector = new OmmApyConnector();
(window as any).ommApyConnector = ommApyConnector
