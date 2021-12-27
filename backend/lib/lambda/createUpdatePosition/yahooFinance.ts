const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const https = require('https');
const yahooFinance = require('yahoo-finance2').default;

async function getTimeSeries(symbol: string, startDate: Date, endDate: Date) {
  console.debug(`Getting quote for ${symbol} from ${startDate} to ${endDate}`);

  // Get quotes from Yahoo Finance
  const data = await yahooFinance.historical(symbol, {
    period1: startDate,
    period2: endDate,
  });

  if (!data) {
    return;
  }

  var result = new Array();

  // TODO Set type for d
  data.map((d: any) => {
    console.debug(`${d.date}: ${d.close}`);

    result.push({
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      adjusted_close: d.adjClose,
      volume: d.volume,
    });
  });

  console.log(`✅ ${JSON.stringify(result)}`);
  return result;
}

async function getSymbol(symbol: string) {
  console.debug(`Looking up symbol for ${symbol}`);

  // Call Yahoo Finance
  const data = await yahooFinance.quote(symbol);

  if (!data) {
    return;
  }

  var result = {
    symbol: data.symbol,
    name: data.displayName,
    description: data.longName,
    exchange: data.fullExchangeName,
    region: data.region,
    currency: data.currency,
  };

  console.debug(`✅ ${JSON.stringify(result)}`);

  return result;
}

module.exports = { getTimeSeries, getSymbol };
