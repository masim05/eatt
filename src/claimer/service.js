const Broker = require('../broker-mock')

class NoClaimedByError extends Error {
}

class NoSharesAvailableError extends Error {
}

class ShareClaimError extends Error {
}

/*
Choose a random share and put it in the user’s account.
claimFreeShare({claimedBy: string}): Promise<{ tickerSymbol: string }>
rejects with one of NoClaimedByError, NoSharesAvailableError, ShareClaimError
 */
async function claimFreeShare({claimedBy} = {}) {
    if (!claimedBy) {
        return Promise.reject(new NoClaimedByError('claimedBy required.'))
    }

    try {
        const broker = new Broker()

        const positions = await broker.getRewardsAccountPositions();
        if (!positions.length) {
            return Promise.reject(new NoSharesAvailableError('No shares on reward account.'))
        }

        const position = positions[Math.floor(Math.random() * positions.length)]

        const result = await broker.moveSharesFromRewardsAccount(claimedBy, position.tickerSymbol);
        if (!result.success) {
            return Promise.reject(new ShareClaimError('Share claim failed.'))
        }

        return Promise.resolve({tickerSymbol: position.tickerSymbol})
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = {
    NoClaimedByError, NoSharesAvailableError, ShareClaimError, claimFreeShare
}
