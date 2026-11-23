export const MIN_SERVICE_PRICE_USD = 0.5;
export const MIN_STRIPE_CHECKOUT_USD = 0.5;

export function formatUSD(
    amount: number | null | undefined,
    options?: { decimals?: boolean }
): string {
    const numeric = Number(amount ?? 0);
    const safeAmount = Number.isFinite(numeric) ? numeric : 0;

    if (options?.decimals) {
        return `$${safeAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    return `$${safeAmount.toLocaleString("en-US", {
        maximumFractionDigits: 2,
    })}`;
}

export function formatStripePaymentError(message: string): string {
    if (
        message.toLowerCase().includes("at least 50 cents") ||
        message.toLowerCase().includes("minimum")
    ) {
        return `Minimum online payment amount is ${formatUSD(MIN_STRIPE_CHECKOUT_USD, { decimals: true })} USD. Please contact the technician or admin to update the final amount.`;
    }

    return message;
}
