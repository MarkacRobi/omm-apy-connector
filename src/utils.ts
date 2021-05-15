export function icxValueToNormalValue(icxValue: number): number {
    return +(icxValue / 1e18).toFixed(2);
}

export function parseHexToNumber(value: string | number): number {
    if (typeof value === 'string')
        return parseInt(value, 16)
    else
        return value;
}

// Returns number divided by the 10^decimals
export function hexToNormalisedNumber(value: number | string, decimals: number = 18): number {
    if (!value) {
        return 0;
    }
    if (typeof value === "string") {
        return +(parseHexToNumber(value) / (Math.pow(10, decimals)));
    } else {
        return +(value / (Math.pow(10, decimals)));
    }
}

export function hexToNumber(value: string | number): number {
    if (!value) {
        return 0;
    }
    if (typeof value === "string") {
        // return rounded down to 2 decimals places number
        return +parseHexToNumber(value);
    }
    else {
        return value;
    }
}
