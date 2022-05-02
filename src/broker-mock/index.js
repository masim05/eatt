const SHARE_PRICES = {
    UAV: 170,
    UBG: 40,
    UEM: 218,
    UFO: 1,
    UHS: 35,
    UJO: 28,
    UKCM: 92,
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

module.exports = class BrokerMock {
    /*
    To fetch a list of assets available for trading
    Broker.listTradableAssets(): Promise<Array<{ tickerSymbol: string }>>
     */
    listTradableAssets() {
        return new Promise((resolve) => {
            const value = Object.keys(SHARE_PRICES).map(t => {
                return {
                    tickerSymbol: t
                }
            })
            resolve(value)
        })
    }

    /*
    To fetch the latest price for an asset
    Broker.getLatestPrice(tickerSymbol: string): Promise<{ sharePrice: number }>
     */
    getLatestPrice(tickerSymbol) {
        return new Promise((resolve, reject) => {
            const value = SHARE_PRICES[tickerSymbol]
            if (value) {
                resolve({sharePrice: value})
            } else {
                reject(new Error(`No tickerSymbol ${tickerSymbol} found.`))
            }
        })
    }

    /*
    To check if the stock market is currently open or closed
    Broker.isMarketOpen(): Promise<{ open: bool, nextOpeningTime: string, nextClosingTime: string }>
     */
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

    /*
    To purchase a share in our Firm's rewards account.
    Broker.buySharesInRewardsAccount(tickerSymbol: string, quantity: number): Promise<{ success: bool, sharePricePaid: number }>
     */
    buySharesInRewardsAccount(tickerSymbol, quantity) {
        return new Promise((resolve) => {
            resolve({success: true, sharePricePaid: SHARE_PRICES[tickerSymbol]})
        })
    }

    /*
    To view the shares that are available in the Firm's rewards account
    Broker.getRewardsAccountPositions(): Promise<Array<{ tickerSymbol: string, quantity: number, sharePrice: number }>>
     */
    getRewardsAccountPositions() {
        return new Promise((resolve) => {
            resolve([
                {tickerSymbol: 'UKR', quantity: 5, sharePrice: 3},
                {tickerSymbol: 'UKW', quantity: 153, sharePrice: 3},
                {tickerSymbol: 'ULE', quantity: 3200, sharePrice: 3},
                {tickerSymbol: 'ULVR', quantity: 3578, sharePrice: 3},
                {tickerSymbol: 'UOG', quantity: 2, sharePrice: 3},
            ])
        })
    }

    /*
    To move shares from our Firm's rewards account to a user's own account
    Broker.moveSharesFromRewardsAccount(toAccount: string, tickerSymbol: string, quantity: number): Promise<{ success: bool }>
     */
    moveSharesFromRewardsAccount(toAccount, tickerSymbol, quantity) {
        return new Promise(resolve => {
            resolve({success: true})
        })
    }
}