const SHARE_PRICES = {
    UAV: 170,
    UBG: 40,
    UEM: 218,
    UFO: 1,
    UHS: 35,
    UJO: 28,
    UKCM: 92,
    UKOG: 0,
    UKR: 3,
    UKW: 153,
    ULE: 3200,
    ULVR: 3578,
    UOG: 2,
    UOS: 550,
    UPGS: 143,
    UPL: 0,
    UPR: 330,
    URAH: 2,
    URU: 400,
    USA: 202,
}

module.exports = class Broker {
    listTradableAssets() {
        return new Promise((resolve) => {
            const value = Object.keys(SHARE_PRICES).map(t => {
                return {
                    tickerSymbol: t
                }
            })
            resolve(value);
        });
    }

    getLatestPrice(tickerSymbol) {
        return new Promise((resolve, reject) => {
            const value = SHARE_PRICES[tickerSymbol]
            if (value) {
                resolve({sharePrice: value})
            } else {
                reject(new Error('No tickerSymbol found.'))
            }
        })
    }

    isMarketOpen() {
        return new Promise((resolve) => {
            const now = new Date();
            const nextClosingTime = now.setHours(now.getHours() + 1)
            const nextOpeningTime = now.setHours(now.getHours() + 8)
            resolve({
                open: true,
                nextClosingTime: new Date(nextClosingTime),
                nextOpeningTime: new Date(nextOpeningTime),
            })
        })
    }

    buySharesInRewardsAccount(tickerSymbol, quantity) {
        return new Promise((resolve) => {
            resolve({success: true, sharePricePaid: 33})
        })
    }
}