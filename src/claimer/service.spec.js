const {
    claimFreeShare,
    NoClaimedByError,
    NoSharesAvailableError,
    ShareClaimError,
} = require('./service')

describe('Claimer', () => {
    describe('claimFreeShare', () => {
        describe.skip('Happy path', () => {
            it('Should return {success: true, tickerSymbol: \'XXX\'}', async () => {
                const result = await claimFreeShare()
                expect(result).toHaveProperty('success')
                expect(result.success).toEqual(true)
                expect(result).toHaveProperty('tickerSymbol')
            })
        })

        describe('No user UUID provided', () => {
            it('Should reject with NoClaimedByError', () => {
                return expect(claimFreeShare()).rejects.toBeInstanceOf(NoClaimedByError);
            })
        })

        describe.skip('No positions on reward account', () => {
            it('Should reject with NoSharesAvailableError', async () => {
                return expect(claimFreeShare()).rejects.toBeInstanceOf(NoSharesAvailableError);
            })
        })

        describe.skip('Share claim failed', () => {
            it('Should reject with ShareClaimError', async () => {
                return expect(claimFreeShare()).rejects.toBeInstanceOf(ShareClaimError);
            })
        })

        describe.skip('Unknown error', () => {
            it('Should reject', async () => {
                return expect(claimFreeShare()).rejects;
            })
        })
    })
})