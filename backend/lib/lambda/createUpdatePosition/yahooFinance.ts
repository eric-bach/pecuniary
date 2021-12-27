const yahooFinance = require('yahoo-finance2').default;

async function getTimeSeries(symbol: string, startDate: Date, endDate: Date) {
  console.debug(`Getting quote for ${symbol} from ${startDate} to ${endDate}`);

  let start = new Date(startDate);
  // Yahoo Finance needs next day
  let end = new Date(new Date(endDate).getTime() + 1000 * 60 * 60 * 24);

  // Get quotes from Yahoo Finance
  const data = await yahooFinance.historical(symbol, {
    period1: start.toISOString().substring(0, 10),
    period2: end.toISOString().substring(0, 10),
    includeAdjustedClose: true,
  });

  if (!data) {
    return;
  }

  var result = new Array();

  // TODO Set type for d
  data.map((d: any) => {
    let date = d.date.toISOString().substring(0, 10);

    console.debug(`${date}: ${d.close}`);

    result.push({
      date: date,
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
