import {AssetTag} from "./Asset";

export class AllAddresses {
  collateral: Collateral;
  oTokens: OTokens;
  systemContract: SystemContract;


  constructor(collateral: Collateral, oTokens: OTokens, systemContract: SystemContract) {
    this.collateral = collateral;
    this.oTokens = oTokens;
    this.systemContract = systemContract;
  }

  collateralAddress(assetTag: AssetTag): string {
    switch (assetTag) {
      case AssetTag.ICX:
        return this.collateral.sICX;
      case AssetTag.USDS:
        return this.collateral.USDS;
      case AssetTag.USDC:
        return this.collateral.IUSDC;
      default:
        return "";
    }
  }

  oTokenAddress(assetTag: AssetTag): string {
    switch (assetTag) {
      case AssetTag.ICX:
        return this.oTokens.oICX;
      case AssetTag.USDS:
        return this.oTokens.oUSDS;
      case AssetTag.USDC:
        return this.oTokens.oIUSDC;
      default:
        return "";
    }
  }
}

interface Collateral {
  USDS: string;
  sICX: string;
  IUSDC: string;
}

interface OTokens {
  oUSDS: string;
  oICX: string;
  oIUSDC: string;
}

interface SystemContract {
  LendingPool: string;
  LendingPoolDataProvider: string;
  Staking: string;
  Rewards: string;
  OmmToken: string;
  Delegation: string;
}
