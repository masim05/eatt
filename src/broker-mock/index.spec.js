const Broker = require('./index')

describe("Broker", () => {

    const broker = new Broker();

    describe("listTradableAssets", () => {
        it("Should return list of tickers", async () => {
            const tickers = await broker.listTradableAssets();
            expect(tickers).toBeInstanceOf(Array)
            for (let t of tickers) {
                expect(t).toHaveProperty('tickerSymbol')
            }
        })
    })

    describe("getLatestPrice", () => {
        it("Should return the latest price for an asset", async () => {
            const price = await broker.getLatestPrice('UEM');
            expect(price).toEqual({sharePrice: 218})
        })
    })

    describe("isMarketOpen", () => {
        it("Should return {open: true}", async () => {
            const isOpen = await broker.isMarketOpen();
            expect(isOpen).toHaveProperty('open')
            expect(isOpen.open).toEqual(true)
        })
    })
})