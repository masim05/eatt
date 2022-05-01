const Broker = require('./index')

describe("BrokerMock", () => {

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
        it("Should return {open: true, nextOpeningTime: XXX, nextClosingTime: YYY}", async () => {
            const isOpen = await broker.isMarketOpen();
            expect(isOpen).toHaveProperty('open')
            expect(isOpen.open).toEqual(true)
            expect(isOpen).toHaveProperty('nextClosingTime')
            expect(isOpen).toHaveProperty('nextOpeningTime')
        })
    })

    describe("buySharesInRewardsAccount", () => {
        it("Should return {success: true, sharePricePaid: X}", async () => {
            const purchase = await broker.buySharesInRewardsAccount('UAV', 2);
            expect(purchase).toHaveProperty('success')
            expect(purchase.success).toEqual(true)
            expect(purchase).toHaveProperty('sharePricePaid')
        })
    })

    describe("getRewardsAccountPositions", () => {
        it("Should return list of positions", async () => {
            const positions = await broker.getRewardsAccountPositions();
            expect(positions).toBeInstanceOf(Array)
            for (let p of positions) {
                expect(p).toHaveProperty('tickerSymbol')
                expect(p).toHaveProperty('quantity')
                expect(p).toHaveProperty('sharePrice')
            }
        })
    })

    describe("moveSharesFromRewardsAccount", () => {
        it("Should return {success: true}", async () => {
            const result = await broker.moveSharesFromRewardsAccount(
                '44789E84-A906-41D9-B675-60501DC160FF',
                'UOS',
                1
            );
            expect(result).toEqual({success: true})
        })
    })
})