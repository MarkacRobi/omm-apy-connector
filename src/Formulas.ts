export class Formulas {
    public static supplyOmmApyFormula(liquidityRate: number, totalInterestOverAYear: number, tokenDistributionPerDay: number,
                               ommPriceUSD: number): number {
        return liquidityRate / totalInterestOverAYear * tokenDistributionPerDay * ommPriceUSD * 0.2 * 365
    }

    public static borrowOmmApyFormula(borrowRate: number, totalInterestOverAYear: number, tokenDistributionPerDay: number,
                               ommPriceUSD: number): number {
        return borrowRate / totalInterestOverAYear * tokenDistributionPerDay * ommPriceUSD * 0.2 * 365;
    }
}
