export function calculatePriceForOffersAndInfluencers(price, currentCurrency) {
    let priceString = String(price);
    let priceWithoutCurrency = parseInt(priceString.replace(/\D/g, ""), 10);

    switch (currentCurrency) {
        case "€":
            return priceWithoutCurrency;
        case "£":
            return Math.round(0.8559 * priceWithoutCurrency);
        case "$":
            return Math.round(1.10 * priceWithoutCurrency);
        default:
            return priceWithoutCurrency;
    }
}

export function doublePrice(priceString) {
    const currencySymbols = ['€', '$', '£'];
    const currencySymbol = currencySymbols.find(symbol => priceString.includes(symbol));
    let numericPart = currencySymbol
        ? priceString.replace(currencySymbol, '').trim()
        : priceString.trim();
    const price = parseFloat(numericPart);
    if (isNaN(price)) {
        throw new Error('Invalid price format');
    }
    const doubledPrice = price * 2;
    return currencySymbol
        ? `${doubledPrice}${currencySymbol}`
        : `${doubledPrice}`;
}

export function calculatePricePerFollower(influencer, currentCurrency) {
    return calculatePriceForOffersAndInfluencers(influencer.price, currentCurrency) / influencer.followersNumber;
}