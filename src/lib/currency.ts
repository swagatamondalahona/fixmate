export const MIN_SERVICE_PRICE_BDT = 100;
export const MIN_STRIPE_CHECKOUT_BDT = 70;

export function formatBDT(
    amount: number | null | undefined,
    options?: { decimals?: boolean }
): string {
    const numeric = Number(amount ?? 0);
    const safeAmount = Number.isFinite(numeric) ? numeric : 0;

    if (options?.decimals) {
        return `৳${safeAmount.toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    return `৳${safeAmount.toLocaleString("en-BD")}`;
}

export function formatStripePaymentError(message: string): string {
    if (
        message.toLowerCase().includes("at least 50 cents") ||
        message.toLowerCase().includes("minimum")
    ) {
        return `Minimum online payment amount is ${formatBDT(MIN_SERVICE_PRICE_BDT)} (Stripe requires at least $0.50 USD). Please contact the technician or admin to update the final amount.`;
    }

    return message;
}
