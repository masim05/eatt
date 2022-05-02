# eatt

### TODO:

- [x] Implement Broker mock in JS
- [x] Implement `POST /claim-free-share` in JS with assumption that we have shares
- [x] Implement background Buyer in JS

### To run:

```bash
git clone https://github.com/masim05/eatt.git
cd eatt
npm i
# run tests
npm test
# start background worker
npm run bg | pino-pretty
# start HTTP API in another terminal
npm start | pino-pretty
# to cleanup local file storage
npm run cleanup
```

### HTTP API:

```bash
curl -XPOST -H 'Content-Type: application/json' -d '{"claimedBy":"AAA"}' localhost:3000/claim-free-share
```

### Description.

The project consists of two main parts: API web server and background worker.
The worker acquires available shares keeping proper price distribution.
Share acquisition may take quite a long time because it checks share prices in the loop,
so I decided to move it in background.

The project uses file `storage.json` as a storage.

### Environment variables

In order to control budget spent on reward shares the worker buys upto
`MAX_SHARES_BUFFER` shares.

In order to control time of one acquisition iteration the worker buys
upto `MAX_SHARES_PER_ITERATION` shares at once.

`INTERVAL` sets time in ms between two acquisition iterations.

`MIN_SHARE_PRICE` and `MAX_SHARE_PRICE` control possible price range.

If you run

```bash
MIN_SHARE_PRICE=350 MAX_SHARE_PRICE=15000 MAX_SHARES_BUFFER=200 MAX_SHARES_PER_ITERATION=50 INTERVAL=5000 npm run bg
```

in about a minute `storage.json` will have 200 shares with proper distribution.

