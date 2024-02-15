const express = require('express');
const storageService = require ('./services/storageService');
const app = express();
const port = 3000;
const cors = require('cors');
const cron = require('node-cron');
let updatedExchangeRates = false;

// cors settings I needed
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// old faithful
app.get('/', (req, res) => {
  res.send('Hello (to you in this beautiful) World!');
});

// get requests from the webapp but work from browser/postman

app.get('/getComparisonList', cors(), async (req, res) => {
  storageService.getComparisonCodes().then((response) => {
    res.send(JSON.stringify(response));
  });
});

app.get('/getUniqueSymbols', cors(), async (req, res) => {
  storageService.getUniqueSymbols().then((response) => {
    res.send(JSON.stringify(response));
  });
});

app.get('/getCurrencyProfiles', cors(), async (req, res) => {
  storageService.getCurrencyProfiles().then((response) => {
    res.send(JSON.stringify(response));
  });
});

app.get('/getHistoricValue', async (req, res) => {
  let params = req.query;
  storageService.getHistoricValue(params).then((response) => {
    res.send(JSON.stringify(response));
  });
});

// Requests that can populate the database from a browser/postman etc

app.get('/buildComparisonList', async (req, res) => {
  await storageService.buildComparisonCodes();
  res.send('Working');
});

app.get('/buildSymbols', async (req, res) => {
  await storageService.buildSymbols();
  res.send('Working');
});

app.get('/buildProfiles', async (req, res) => {
  await storageService.buildProfiles();
  res.send('Working');
});

// Starting point
app.listen(port, () => {
  console.log(`The FBI are not listening on http://localhost:${port}, because this server is`);
  startCrons();
});

// Crons
startCrons = () => {
  // Cron to get latest exchange rates
  cron.schedule('0-59 * * * *', () => {
    if (!updatedExchangeRates) {
      console.log('Checking every minute');
      storageService.getNewestExchangeRates();
      updatedExchangeRates = true;
    }
  });

  // Cron to reset the blocker for the exchange rates cron
  cron.schedule('* 5 * * *', () => {
    console.log('Allowing exchange rates to update');
    updatedExchangeRates = false;
  });
}