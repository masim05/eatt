const Broker = require('../broker-mock')
/*
A service which buys shares. Algorithm forces that 95% of distributed rewards to have a value between £3-£10,
3% between £10-£25 and 2% between £25-£200.
 */

/*
Range 0 stands for £3-£10
Range 1 stands for £10-£25
Range 2 stands for £25-£200

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

module.exports = {computeAvailablePriceRanges}
