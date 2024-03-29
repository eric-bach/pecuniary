const yahooFinance = require('yahoo-finance2').default;

// Return the quoteSummary
async function getQuoteSummary(symbol: string) {
  console.debug(`Getting quote for ${symbol}`);

  // Get quotes from Yahoo Finance
  const data = await yahooFinance.quoteSummary(symbol, {
    modules: ['price'],
  });

  if (!data) {
    return;
  }

  var result = {
    symbol: symbol,
    description: data.price.longName,
    exchange: data.price.exchangeName,
    currency: data.price.currency,
    date: data.price.regularMarketTime.toISOString().substring(0, 10),
    open: data.price.regularMarketOpen,
    high: data.price.regularMarketDayHigh,
    low: data.price.regularMarketDayLow,
    close: data.price.regularMarketPrice,
    volume: data.price.regularMarketVolume,
  };

  console.log(`✅ Retrieved quote summary: ${JSON.stringify(result)}`);
  return result;
}

// Return historical quote for date range
async function getHistorical(symbol: string, startDate: Date, endDate: Date) {
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

module.exports = { getQuoteSummary, getHistorical };
