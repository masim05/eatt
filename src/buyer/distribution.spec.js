const {
    computeAvailablePriceRanges, buyShare, buyShares
} = require('./distribution')

describe('Distribution buyer', () => {
    describe('computeAvailablePriceRanges', () => {
        it('Should return [true, false, false] in the begining', () => {
            expect(computeAvailablePriceRanges([])).toEqual([true, false, false])
        })

        it('Should return [true, false, false] when no many cheap shares', () => {
            expect(computeAvailablePriceRanges([
                {tickerSymbol: 'UKA', quantity: 10, sharePrice: 400},
            ])).toEqual([true, false, false])
        })

        it('Should return [true, true, true] when enough cheap shares', () => {
            expect(computeAvailablePriceRanges([
                {tickerSymbol: 'UKA', quantity: 10, sharePrice: 400},
                {tickerSymbol: 'ULE', quantity: 90, sharePrice: 400},
            ])).toEqual([true, true, true])
        })

        it('Should return [true, false, true] when enough cheap and medium shares', () => {
            expect(computeAvailablePriceRanges([
                {tickerSymbol: 'ULE', quantity: 10, sharePrice: 400},
                {tickerSymbol: 'YDX', quantity: 40, sharePrice: 400},
                {tickerSymbol: 'SCO', quantity: 1, sharePrice: 1400},
            ])).toEqual([true, false, true])
        })

        it('Should return [true, true, false] when enough cheap and expensive shares', () => {
            expect(computeAvailablePriceRanges([
                {tickerSymbol: 'ULE', quantity: 10, sharePrice: 400},
                {tickerSymbol: 'YDX', quantity: 40, sharePrice: 400},
                {tickerSymbol: 'SCO', quantity: 1, sharePrice: 3000},
            ])).toEqual([true, true, false])
        })

        it('Should return [true, false, false] when enough cheap, medium and expensive shares', () => {
            expect(computeAvailablePriceRanges([
                {tickerSymbol: 'ULE', quantity: 10, sharePrice: 400},
                {tickerSymbol: 'YDX', quantity: 40, sharePrice: 400},
                {tickerSymbol: 'SCO', quantity: 1, sharePrice: 1200},
                {tickerSymbol: 'BPT', quantity: 1, sharePrice: 3000},
            ])).toEqual([true, false, false])
        })
    })

    describe('buyShare', () => {
        describe('Happy path', () => {
            it('Should return {success: true, sharePricePaid: AAA, tickerSymbol: \'BBB\'}', async () => {
                jest.useFakeTimers('modern')
                // Mock `new Date()` with '2022-05-02 18:30:10' - market is open
                jest.setSystemTime(new Date(2022, 5, 2, 18, 30, 10))
                const result = await buyShare();
                jest.useRealTimers()

                expect(result).toHaveProperty('success')
                expect(result.success).toEqual(true)
                expect(result).toHaveProperty('tickerSymbol')
                expect(result).toHaveProperty('sharePricePaid')
            })
        })
    })

    describe('buyShares', () => {
        describe('Happy path', () => {
            it('Should return array of positions', async () => {
                jest.useFakeTimers('modern')
                // Mock `new Date()` with '2022-05-02 18:30:10' - market is open
                jest.setSystemTime(new Date(2022, 5, 2, 18, 30, 10))
                const positions = await buyShares();
                jest.useRealTimers()

                expect(positions).toBeInstanceOf(Array)
                for (let p of positions) {
                    expect(p).toHaveProperty('tickerSymbol')
                    expect(p).toHaveProperty('sharePricePaid')
                    expect(p).toHaveProperty('success')
                    expect(p.success).toEqual(true)
                }

            })
        })
    })
})