const SHARE_PRICES = {
    UAV: 1700,
    UBG: 4000,
    UEM: 21800,
    UFO: 400,
    UHS: 3500,
    UJO: 2800,
    UKCM: 9200,
    UKR: 300,
    UKW: 1530,
    ULE: 320000,
    ULVR: 357800,
    UOG: 200,
    UOS: 550,
    UPGS: 14300,
    UPR: 33000,
    URAH: 200,
    URU: 40000,
    USA: 20200,
}
const STORAGE_PATH = (process.env.NODE_ENV === 'test') ? './storage.test.json' : './storage.json'

module.exports = {
    SHARE_PRICES, STORAGE_PATH
}