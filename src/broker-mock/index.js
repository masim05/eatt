module.exports = class Broker {
    listTradableAssets() {
        return new Promise((resolve) => {
            resolve([
                {tickerSymbol: 'UAV'},
                {tickerSymbol: 'UBG'},
                {tickerSymbol: 'UEM'},
                {tickerSymbol: 'UFO'},
                {tickerSymbol: 'UHS'},
                {tickerSymbol: 'UJO'},
                {tickerSymbol: 'UKCM'},
                {tickerSymbol: 'UKOG'},
                {tickerSymbol: 'UKR'},
                {tickerSymbol: 'UKW'},
                {tickerSymbol: 'ULE'},
                {tickerSymbol: 'ULVR'},
                {tickerSymbol: 'UOG'},
                {tickerSymbol: 'UOS'},
                {tickerSymbol: 'UPGS'},
                {tickerSymbol: 'UPL'},
                {tickerSymbol: 'UPR'},
                {tickerSymbol: 'URAH'},
                {tickerSymbol: 'URU'},
                {tickerSymbol: 'USA'},
            ]);
        });
    }

    getLatestPrice(tickerSymbol) {
        const prices = {
            UAV: 170,
            UBG: 40,
            UEM: 218,
            UFO: 1,
            UHS: 35,
            UJO: 28,
            UKCM: 92,
            UKOG: 0,
            UKR: 3,
            UKW: 153,
            ULE: 3200,
            ULVR: 3578,
            UOG: 2,
            UOS: 550,
            UPGS: 143,
            UPL: 0,
            UPR: 330,
            URAH: 2,
            URU: 400,
            USA: 202,
        }
        return new Promise((resolve, reject) => {
            const value = prices[tickerSymbol]
            if (value) {
                resolve({sharePrice: value})
            } else {
                reject(new Error('No tickerSymbol found.'))
            }
        })
    }
}