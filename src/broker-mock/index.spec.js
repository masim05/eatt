const fs = require('fs')

const Broker = require('./index')

const {SHARE_PRICES, STORAGE_PATH} = require('./constants')

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
            expect(price).toEqual({sharePrice: 21800})
        })
    })

    describe("isMarketOpen", () => {
        it("Should return {open: true,...} if seconds < 30", async () => {
            jest.useFakeTimers('modern')
            // Mock `new Date()` with '2022-05-02 18:30:10'
            jest.setSystemTime(new Date(2022, 5, 2, 18, 30, 10))
            const isOpen = await broker.isMarketOpen()
            jest.useRealTimers()
            expect(isOpen).toHaveProperty('open')
            expect(isOpen.open).toEqual(true)
            expect(isOpen).toHaveProperty('nextClosingTime')
            expect(isOpen).toHaveProperty('nextOpeningTime')
        })

        it("Should return {open: false,...} if seconds >= 30", async () => {
            jest.useFakeTimers('modern')
            // Mock `new Date()` with '2022-05-02 18:30:30'
            jest.setSystemTime(new Date(2022, 5, 2, 18, 30, 30))
            const isOpen = await broker.isMarketOpen()
            jest.useRealTimers()
            expect(isOpen).toHaveProperty('open')
            expect(isOpen.open).toEqual(false)
            expect(isOpen).toHaveProperty('nextClosingTime')
            expect(isOpen).toHaveProperty('nextOpeningTime')
        })
    })

    describe("buySharesInRewardsAccount", () => {
        describe("Happy path", () => {
            beforeEach(() => {
                if (fs.existsSync(STORAGE_PATH)) fs.unlinkSync(STORAGE_PATH)
            })

            afterEach(() => {
                if (fs.existsSync(STORAGE_PATH)) fs.unlinkSync(STORAGE_PATH)
            })

            it("Should return {success: true, sharePricePaid: X}", async () => {
                jest.useFakeTimers('modern')
                // Mock `new Date()` with '2022-05-02 18:30:10' - market is open
                jest.setSystemTime(new Date(2022, 5, 2, 18, 30, 10))
                const purchase = await broker.buySharesInRewardsAccount('UAV', 2);
                jest.useRealTimers()
                expect(purchase).toHaveProperty('success')
                expect(purchase.success).toEqual(true)
                expect(purchase).toHaveProperty('sharePricePaid')

                const content = fs.readFileSync(STORAGE_PATH)
                const positions = JSON.parse(content)
                expect(positions).toEqual([{
                    tickerSymbol: 'UAV',
                    quantity: 2,
                    sharePricePaid: SHARE_PRICES['UAV']
                }])
            })
        })

        describe("Market is closed", () => {
            it("Should reject with error", async () => {
                jest.useFakeTimers('modern')
                // Mock `new Date()` with '2022-05-02 18:30:40' - market is closed
                jest.setSystemTime(new Date(2022, 5, 2, 18, 30, 40))
                await expect(broker.buySharesInRewardsAccount('UAV', 2))
                    .rejects
                    .toBeInstanceOf(Error);
                jest.useRealTimers()
            })
        })
    })

    describe("getRewardsAccountPositions", () => {
        beforeEach(() => {
            if (fs.existsSync(STORAGE_PATH)) fs.unlinkSync(STORAGE_PATH)
            fs.writeFileSync(STORAGE_PATH, JSON.stringify([{
                tickerSymbol: 'UKR',
                quantity: 3,
                sharePrice: 500
            }]))
        })

        afterEach(() => {
            if (fs.existsSync(STORAGE_PATH)) fs.unlinkSync(STORAGE_PATH)
        })

        it("Should return list of positions", async () => {
            const positions = await broker.getRewardsAccountPositions()
            expect(positions).toEqual([{
                tickerSymbol: 'UKR',
                quantity: 3,
                sharePrice: 500
            }])
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