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
})