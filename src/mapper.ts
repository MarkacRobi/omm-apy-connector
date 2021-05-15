import {ReserveData} from "./models/AllReservesData";
import {hexToNormalisedNumber, hexToNumber} from "./utils";

export class Mapper {



  public static mapReserveData(reserveData: ReserveData): ReserveData {
    const decimals = hexToNumber(reserveData.decimals);

    return new ReserveData(
      hexToNormalisedNumber(reserveData.totalLiquidity, decimals),
      hexToNormalisedNumber(reserveData.availableLiquidity, decimals),
      hexToNormalisedNumber(reserveData.totalLiquidityUSD),
      hexToNormalisedNumber(reserveData.availableLiquidityUSD),
      hexToNormalisedNumber(reserveData.totalBorrows, decimals),
      hexToNormalisedNumber(reserveData.totalBorrowsUSD),
      hexToNormalisedNumber(reserveData.liquidityRate),
      hexToNormalisedNumber(reserveData.borrowRate),
      reserveData.oTokenAddress,
      hexToNormalisedNumber(reserveData.exchangePrice),
      hexToNumber(reserveData.lastUpdateTimestamp),
      hexToNormalisedNumber(reserveData.baseLTVasCollateral),
      hexToNormalisedNumber(reserveData.borrowCumulativeIndex),
      hexToNumber(reserveData.borrowingEnabled),
      hexToNumber(reserveData.decimals),
      hexToNumber(reserveData.isActive),
      hexToNumber(reserveData.isFreezed),
      hexToNormalisedNumber(reserveData.liquidationBonus),
      hexToNormalisedNumber(reserveData.liquidationThreshold),
      hexToNormalisedNumber(reserveData.liquidityCumulativeIndex),
      reserveData.reserveAddress,
      hexToNormalisedNumber(reserveData.sICXRate),
      hexToNumber(reserveData.usageAsCollateralEnabled),
    );
  }

}
