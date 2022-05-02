const logger = require('pino')()

const Broker = require('../broker-mock')

/*
A service which buys shares. Algorithm forces that 95% of distributed rewards to have a value between £3-£10,
3% between £10-£25 and 2% between £25-£200.

Range 0 stands for £3-£10
Range 1 stands for £10-£25
Range 2 stands for £25-£200

Note: prices are in penny sterlings.
 */

class AcquireFailedError extends Error {
}

/*
Buy one share keeping correct distribution.
 */
async function buyShare({minPrice, maxPrice} = {}) {
    if (!minPrice) minPrice = 0
    if (!maxPrice) maxPrice = Infinity

    try {
        const broker = new Broker()

        const isOpen = await broker.isMarketOpen()
        if (!isOpen.open) {
            return Promise.reject(isOpen)
        }

        const assets = await broker.listTradableAssets()

        const positions = await broker.getRewardsAccountPositions()
        const availableRanges = computeAvailablePriceRanges(positions)
        for (let i = 0; i < assets.length; i++) {
            const p = await broker.getLatestPrice(assets[i].tickerSymbol)

            if (p.sharePrice < minPrice) continue
            if (p.sharePrice < 300) continue
            if (p.sharePrice > maxPrice) continue
            if (p.sharePrice > 20000) continue

            let res;
            if (availableRanges[2]) {
                // Wait for an expensive share to come
                if (p.sharePrice >= 2500) {
                    res = await broker.buySharesInRewardsAccount(assets[i].tickerSymbol, 1)
                } else {
                    continue
                }
            } else if (availableRanges[1]) {
                // Wait for a medium price share to come
                if (p.sharePrice >= 1000 && p.sharePrice < 2500) {
                    res = await broker.buySharesInRewardsAccount(assets[i].tickerSymbol, 1)
                } else {
                    continue
                }
            } else if (p.sharePrice < 1000) {
                // Wait for a cheap price share to come
                res = await broker.buySharesInRewardsAccount(assets[i].tickerSymbol, 1)
            } else {
                // Jump to the next loop
                continue
            }
            if (!res.success) {
                const err = new AcquireFailedError()
                logger.error(err)
                return Promise.reject(err)
            }

            logger.info(res, `${assets[i].tickerSymbol} was acquired.`)
            return Promise.resolve({...res, tickerSymbol: assets[i].tickerSymbol})
        }
    } catch (error) {
        logger.error(error)
        return Promise.reject(error)
    }
}

/*
Buy several shares keeping correct distribution.
maxSharesBuffer: Control the budget by limiting amount of shares in reward account.
maxSharesPerIteration: Control execution time of background job by limiting amount of shares to buy.
 */
async function buyShares({minPrice, maxPrice, maxSharesBuffer, maxSharesPerIteration} = {}) {
    if (!minPrice) minPrice = 0
    if (!maxPrice) maxPrice = Infinity
    if (!maxSharesBuffer) maxSharesBuffer = 10
    if (!maxSharesPerIteration) maxSharesPerIteration = 5

    try {
        const broker = new Broker()
        const positions = await broker.getRewardsAccountPositions()
        const sharesTotal = positions.length ? positions.map(p => p.quantity).reduce((total, q) => total + q) : 0
        const sharesToBuyNow = Math.min(maxSharesBuffer - sharesTotal, maxSharesPerIteration)
        let acquired = [];
        for (let i = 0; i < sharesToBuyNow; i++) {
            const result = await buyShare({minPrice, maxPrice})
            if (result.success) acquired.push(result)
        }
        logger.info(`Acquired ${acquired.length} shares: ${[...new Set(acquired.map(a => a.tickerSymbol))]}`)
        return Promise.resolve(acquired)
    } catch (error) {
        logger.error(error)
    }
}

/*
computeAvailablePriceRange(positions): Array<bool>
Each element of the array represents if next share to buy can have the corresponding price range in order to keep
proper distribution.
 */
function computeAvailablePriceRanges(positions) {
    let total0 = 0, total1 = 0, total2 = 0
    for (let i = 0; i < positions.length; i++) {
        const p = positions[i]
        // Note: LSE uses GBX (penny sterlings)
        if (p.sharePrice >= 300 && p.sharePrice < 1000) total0 = total0 + p.quantity
        if (p.sharePrice >= 1000 && p.sharePrice < 2500) total1 = total1 + p.quantity
        if (p.sharePrice >= 2500 && p.sharePrice < 20000) total2 = total2 + p.quantity
    }

    const total = total0 + total1 + total2

    // It is always ok to buy a share from the cheapest range
    const result = [true, false, false]
    // Control share price distribution
    if ((total1 + 1) / (total + 1) <= 0.03) result[1] = true
    if ((total2 + 1) / (total + 1) <= 0.02) result[2] = true

    return result
}

module.exports = {buyShare, computeAvailablePriceRanges, buyShares}
