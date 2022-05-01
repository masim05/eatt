const AsyncRouter = require('express-async-router').AsyncRouter
const jsonParser = require('body-parser').json()


const {
    NoSharesAvailableError, ShareClaimError, claimFreeShare
} = require('./service')

const router = AsyncRouter()
router.use(jsonParser);

router.post('/', async (req, res) => {
    const {claimedBy} = req.body

    if (!claimedBy) {
        return res.status(400).json({message: 'claimedBy required.', success: false})
    }

    try {
        let {tickerSymbol} = await claimFreeShare({claimedBy});
        return res.json({message: `You got ${tickerSymbol} for free.`, success: true, tickerSymbol})
    } catch (error) {
        // Log warnings in case of third party errors
        if (error instanceof NoSharesAvailableError) {
            req.log.warn(error)
            return res.json({message: 'Please try later.', success: false})
        } else if (error instanceof ShareClaimError) {
            req.log.warn(error)
            return res.json({message: 'Please try later.', success: false})
        }

        // Handle for all the rest error here
        req.log.error(error)
        res.status(500).json({message: 'Internal error.'})
    }
});

module.exports = router;