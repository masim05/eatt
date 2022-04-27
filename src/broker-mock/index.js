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
}