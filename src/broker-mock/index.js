const SHARE_PRICES = {
    UAV: 1700,
    UBG: 4000,
    UEM: 21800,
    UFO: 400,
    UHS: 3500,
    UJO: 2800,
    UKCM: 9200,
    UKR: 300,
    UKW: 1530,
    ULE: 320000,
    ULVR: 357800,
    UOG: 200,
    UOS: 550,
    UPGS: 14300,
    UPR: 33000,
    URAH: 200,
    URU: 40000,
    USA: 20200,
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
    Simulate it works if `new Date(now).getSeconds() < 30` and doesn't work otherwise
     */
    isMarketOpen() {
        return new Promise((resolve) => {
            const now = new Date()
            const thisMinute = new Date(now).setSeconds(0)
            const nextMinute = new Date(thisMinute).setMinutes(new Date(thisMinute).getMinutes() + 1)
            let nextClosingTime, nextOpeningTime, open
            if (now.getSeconds() < 30) {
                open = true
                nextOpeningTime = nextMinute
                nextClosingTime = (new Date(thisMinute)).setSeconds(30)
            } else {
                open = false
                nextOpeningTime = nextMinute
                nextClosingTime = (new Date(nextMinute)).setSeconds(30)
            }

            resolve({
                open,
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
        return new Promise(async (resolve, reject) => {
            const isOpen = await this.isMarketOpen()
            if (!isOpen.open) return reject(new Error('Market is closed.'))

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
                {tickerSymbol: 'UKR', quantity: 3, sharePrice: 500},
                {tickerSymbol: 'UKW', quantity: 3, sharePrice: 1530},
                {tickerSymbol: 'ULE', quantity: 3, sharePrice: 3200},
                {tickerSymbol: 'ULVR', quantity: 3, sharePrice: 3578},
                {tickerSymbol: 'UOG', quantity: 3, sharePrice: 2000},
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