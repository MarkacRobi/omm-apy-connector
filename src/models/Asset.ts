export class Asset {
  className: AssetClass; // e.g. "usds"
  name: AssetName; // e.g. "Stably USD"
  tag: AssetTag; // e.g. USDS

  constructor(className: AssetClass, name: AssetName, tag: AssetTag) {
    this.className = className;
    this.name = name;
    this.tag = tag;
  }
}

export enum AssetClass {
  USDS = "usds",
  ICX = "icx",
  USDC = "usdc"
}

export enum AssetName {
  USDS = "Stably USD",
  ICX = "ICON",
  USDC = "ICON USD Coin"
}

export enum AssetTag {
  USDS = "USDS",
  ICX = "ICX",
  USDC = "IUSDC"
}

export const supportedAssetsMap: Map<AssetTag, Asset> = new Map([
  [AssetTag.USDS, new Asset(AssetClass.USDS, AssetName.USDS, AssetTag.USDS)],
  [AssetTag.ICX, new Asset(AssetClass.ICX, AssetName.ICX , AssetTag.ICX)],
  [AssetTag.USDC, new Asset(AssetClass.USDC, AssetName.USDC , AssetTag.USDC)],
]);



