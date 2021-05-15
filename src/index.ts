import {hexToNormalisedNumber, icxValueToNormalValue} from "./utils";
import {AllAddresses} from "./models/AllAddresses";
import {ScoreMethodNames} from "./models/score-method-names";
import {AllReservesData, ReserveData} from "./models/AllReservesData";
import {Mapper} from "./mapper";
import {AssetTag} from "./models/Asset";

const IconService = require("icon-sdk-js");
const {IconBuilder, IconAmount, IconConverter} = IconService;
const { CallBuilder, CallTransactionBuilder, IcxTransactionBuilder,  } = IconBuilder;

console.log("index.js loaded..")

export class OmmApyConnector {
    /**
     * Constants setup
     */
    private iconRpcUrl  = "https://bicon.net.solidwallet.io/api/v3" // testnet
    private httpProvider = new IconService.HttpProvider(this.iconRpcUrl);
    private iconService = new IconService(this.httpProvider);
    private addressProviderScore = "cx77497caa623b73bb492942081eb809f824b9c82a"

    /**
     * Variables holding necessary static data
     */
    public allScoreAddresses?: AllAddresses;
    public tokenDistributionPerDay?: number;

    constructor() {}

    /**
     * Get reserve data for USDb
     */
    public getUSDbReserveData(): Promise<ReserveData> {
        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(AssetTag.USDB));
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
     * @param {AssetTag} assetTag - Tag of the asset we want tot retrieve APY for (USDB, ICX or IUSDC).
     * @return {number} Reserve APY (liquidity rate).
     */
    public async getSupplyApyForReserve(assetTag: AssetTag): Promise<number> {
        return this.getSpecificReserveData(this.allScoreAddresses!.collateralAddress(assetTag))
            .then(reserveData => reserveData.getSupplyApy());
    }

    /**
     * @description Retrieve borrow APY (borrow rate) for specific asset tag.
     * @param {AssetTag} assetTag - Tag of the asset we want tot retrieve APY for (USDB, ICX or IUSDC).
     * @return {number} Reserve APY (liquidity rate).
     */
    public async getBorrowApyForReserve(assetTag: AssetTag): Promise<number> {
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

    /** @description Retrieve USDb Supply OMM rewards APY
     * formula: USDb liquidity rate/((CollateralBalanceUSD *liquidityRate)) for all users * Token Distribution for that day * 0.2 *365
     */
    public async USDbSupplyOmmRewardsApy(): Promise<number> {
        return this.getUSDbReserveData().then(async reserveData => {
            const usdbLiquidityRate = reserveData.liquidityRate;
            const usdbTotalLiquidity = reserveData.totalLiquidityUSD

            if (!this.tokenDistributionPerDay) {
                await this.loadTokenDistributionForDay()
            }

            return usdbLiquidityRate / usdbTotalLiquidity * this.tokenDistributionPerDay! * 0.2 * 365;
        })
    }

    /**
     * @description Get all SCORE addresses (collateral, oTokens, System Contract, ..)
     * @return  List os collateral, oTokens and System Contract addresses
     */
    public async getAllScoreAddresses(): Promise<AllAddresses> {
        const tx = this.buildReadTransaction(this.addressProviderScore,
            ScoreMethodNames.GET_ALL_ADDRESSES, {});
        return this.iconService.call(tx).execute();
    }

    /**
     * @description Get reserve data for a specific reserve
     * @param reserve - Address using 1 a  for USDb and sICX
     * @return ReserveData
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
     * @return All reserve data
     */
    public async getAllReserveData(): Promise<AllReservesData> {
        if (!this.allScoreAddresses) {
            await this.loadAllAddresses();
        }

        const tx = this.buildReadTransaction( this.allScoreAddresses!.systemContract.LendingPoolDataProvider,
            ScoreMethodNames.GET_ALL_RESERVE_DATA, {});

        const allReserves = await this.iconService.call(tx).execute();

        const newAllReserve = new AllReservesData(allReserves.USDB, allReserves.ICX, allReserves.USDC);
        Object.entries(newAllReserve).forEach((value: [string, ReserveData]) => {
            // @ts-ignore
            newAllReserve[value[0]] = Mapper.mapReserveData(value[1]);
        });

        return newAllReserve;
    }

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


    public async loadTokenDistributionForDay(): Promise<void> {
        await this.getTokenDistributionForDay()
            .then(res => this.tokenDistributionPerDay = res);
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

export default OmmApyConnector
