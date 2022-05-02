const {
    claimFreeShare,
    NoClaimedByError,
    NoSharesAvailableError,
    ShareClaimError,
} = require('./service')

describe('Claimer', () => {
    describe('claimFreeShare', () => {
        describe('No user UUID provided', () => {
            it('Should reject with NoClaimedByError', () => {
                return expect(claimFreeShare()).rejects.toBeInstanceOf(NoClaimedByError);
            })
        })
    })
})