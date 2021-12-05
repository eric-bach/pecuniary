const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const https = require('https');

async function getTimeSeries(symbol: string, startDate: Date, endDate: Date) {
  console.debug(`Getting quote for ${symbol} from ${startDate} to ${endDate}`);

  // Call AlphaVantage TIME_SERIES_DAILY_ADJUSTED
  const apiKey = await getApiKey(process.env.ALPHA_VANTAGE_API_KEY || '');
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

  // Get quotes from AlphaVantage
  var data: any = await get(url);

  if (!data) {
    return;
  }

  var timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    return;
  }

  var result = new Array();

  // loop for every day
  var from = new Date(startDate);
  var to = new Date(endDate);
  for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
    var date = day.toISOString().substring(0, 10);

    // Ignore weekends
    if (day.getDay() == 6 || day.getDay() == 0) {
      console.log('🔔 Skipping weekend days: ', date);
      continue;
    }

    try {
      console.log(`${date}: ${timeSeries[`${date}`]['4. close']}`);

      result.push({
        date: date,
        open: timeSeries[`${date}`]['1. open'],
        high: timeSeries[`${date}`]['2. high'],
        low: timeSeries[`${date}`]['3. low'],
        close: timeSeries[`${date}`]['4. close'],
        adjusted_close: timeSeries[`${date}`]['5. adjusted close'],
        volume: timeSeries[`${date}`]['6. volume'],
        dividend: timeSeries[`${date}`]['7. dividend amount'],
        split_coefficient: timeSeries[`${date}`]['8. split coefficient'],
      });
    } catch (error) {
      console.log('🔔 No market data for: ', date);
      continue;
    }
  }

  console.log(`✅ ${JSON.stringify(result)}`);

  return result;
}

async function getSymbol(symbol: string) {
  console.debug(`Looking up symbol for ${symbol}`);

  // Call AlphaVantage SYMBOL_SEARCH
  const apiKey = await getApiKey(process.env.ALPHA_VANTAGE_API_KEY || '');
  var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${apiKey}`;

  // Get symbol matches from AlphaVantage
  var data: any = await get(url);

  if (!data) {
    return;
  }

  var results = data['bestMatches'][0];
  if (!results) {
    return;
  }

  var result = {
    symbol: results['1. symbol'],
    name: results['2. name'],
    type: results['3. type'],
    region: results['4. region'],
    currency: results['8. currency'],
  };

  console.debug(`✅ ${JSON.stringify(result)}`);

  return result;
}

// TODO Only works for US stocks (for now?)
async function getOverview(symbol: string) {
  console.debug(`Getting overview for ${symbol}`);

  // Call AlphaVantage OVERVIEW
  const apiKey = await getApiKey(process.env.ALPHA_VANTAGE_API_KEY || '');
  var url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;

  // Get overview from AlphaVantage
  var data: any = await get(url);
  if (!data) {
    return;
  }

  var result = {
    symbol: symbol,
    name: data.Name,
    type: data.Exchange,
    currency: data.Currency,
    country: data.Country,
    sector: data.Sector,
    industry: data.Industry,
    address: data.Address,
    marketCapitalization: data.MarketCapitalization,
    peRatio: data.PERatio,
    dividendPerShare: data.DividendPerShare,
    dividendYield: data.DividendYield,
    eps: data.EPS,
  };

  console.debug(`✅ ${JSON.stringify(result)}`);

  return result;
}

const getApiKey = async (name: string) => {
  const client = new SSMClient();
  const input = {
    Name: name,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(input);
  const response = await client.send(command);

  return response.Parameter.Value;
};

function get(url: string) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res: any) => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', (chunk: any) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (err: any) => {
      reject(err);
    });

    req.end();
  });
}

module.exports = { getTimeSeries, getSymbol, getOverview };
