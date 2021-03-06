import {AssetTag} from "./Asset";

export class AllReservesData {
  USDS: ReserveData;
  ICX: ReserveData;
  USDC: ReserveData;

  constructor(USDS: ReserveData, sICX: ReserveData, IUSDC: ReserveData) {
    this.USDS = USDS;
    this.ICX = sICX;
    this.USDC = IUSDC;
  }

  public getReserveData(assetTag: AssetTag): ReserveData {
    switch (assetTag) {
      case AssetTag.ICX:
        return this.ICX;
      case AssetTag.USDS:
        return this.USDS;
      case AssetTag.USDC:
        return this.USDC;
      default:
        throw new Error(`AllReserves.getReserveData: Unsupported parameter = ${assetTag}`);
    }
  }

  public setReserveData(assetTag: AssetTag, reserveData: ReserveData): void {
    switch (assetTag) {
      case AssetTag.ICX:
        this.ICX = reserveData;
        break;
      case AssetTag.USDS:
        this.USDS = reserveData;
        break;
      case AssetTag.USDC:
        this.USDC = reserveData;
        break;
      default:
        throw new Error(`AllReserves.setReserveData: Unsupported parameter = ${assetTag}`);
    }
  }
}

export class ReserveData {
  totalLiquidity: number;
  availableLiquidity: number;
  totalLiquidityUSD: number;
  availableLiquidityUSD: number;
  totalBorrows: number;
  totalBorrowsUSD: number;
  liquidityRate: number;
  borrowRate: number;
  oTokenAddress: string;
  exchangePrice: number;
  lastUpdateTimestamp: number;
  baseLTVasCollateral: number;
  borrowCumulativeIndex: number;
  borrowingEnabled: number;
  decimals: number;
  isActive: number;
  isFreezed: number;
  liquidationBonus: number;
  liquidationThreshold: number;
  liquidityCumulativeIndex: number;
  reserveAddress: string;
  sICXRate: number;
  usageAsCollateralEnabled: number;

  constructor(totalLiquidity: number, availableLiquidity: number, totalLiquidityUSD: number, availableLiquidityUSD: number,
              totalBorrows: number, totalBorrowsUSD: number, liquidityRate: number, borrowRate: number, oTokenAddress: string,
              exchangePrice: number, lastUpdateTimestamp: number, baseLTVasCollateral: number, borrowCumulativeIndex: number,
              borrowingEnabled: number, decimals: number, isActive: number, isFreezed: number, liquidationBonus: number,
              liquidationThreshold: number, liquidityCumulativeIndex: number, reserveAddress: string, sICXRate: number,
              usageAsCollateralEnabled: number) {
    this.totalLiquidity = totalLiquidity;
    this.availableLiquidity = availableLiquidity;
    this.totalLiquidityUSD = totalLiquidityUSD;
    this.availableLiquidityUSD = availableLiquidityUSD;
    this.totalBorrows = totalBorrows;
    this.totalBorrowsUSD = totalBorrowsUSD;
    this.liquidityRate = liquidityRate;
    this.borrowRate = borrowRate;
    this.oTokenAddress = oTokenAddress;
    this.exchangePrice = exchangePrice;
    this.lastUpdateTimestamp = lastUpdateTimestamp;
    this.baseLTVasCollateral = baseLTVasCollateral;
    this.borrowCumulativeIndex = borrowCumulativeIndex;
    this.borrowingEnabled = borrowingEnabled;
    this.decimals = decimals;
    this.isActive = isActive;
    this.isFreezed = isFreezed;
    this.liquidationBonus = liquidationBonus;
    this.liquidationThreshold = liquidationThreshold;
    this.liquidityCumulativeIndex = liquidityCumulativeIndex;
    this.reserveAddress = reserveAddress;
    this.sICXRate = sICXRate;
    this.usageAsCollateralEnabled = usageAsCollateralEnabled;
  }

  getSupplyApy(): number {
    return this.liquidityRate;
  }

  getBorrowApy(): number {
    return this.borrowRate;
  }
}

// Example
// availableLiquidity: "0x8848ec5632c44e279"
// availableLiquidityUSD: "0x4424762b19622713d"
// baseLTVasCollateral: "0x6f05b59d3b20000"
// borrowCumulativeIndex: "0xde0b6b3a7640000"
// borrowRate: "0x0"
// borrowingEnabled: "0x1"
// decimals: "0x12"
// exchangePrice: "0x6f05b59d3b20000"
// isActive: "0x1"
// isFreezed: "0x0"
// lastUpdateTimestamp: "0x5b9aa7dcd49c3"
// liquidationBonus: "0x16345785d8a0000"
// liquidationThreshold: "0x905438e60010000"
// liquidityCumulativeIndex: "0xde0b6b3a7640000"
// liquidityRate: "0x0"
// oTokenAddress: "cx7dcf7232084a085507bf2685f785589ebb0b52a1"
// reserveAddress: "cxb7eda227d9ed9c6fc2a74aa5dd7e9a3913f6c281"
// totalBorrows: "0x0"
// totalBorrowsUSD: "0x0"
// totalLiquidity: "0x8848ec5632c44e279"
// totalLiquidityUSD: "0x4424762b19622713d"
// usageAsCollateralEnabled: "0x1"



