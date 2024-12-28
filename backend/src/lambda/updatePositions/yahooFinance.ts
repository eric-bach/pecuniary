import yahooFinance from 'yahoo-finance2';

// Return the quoteSummary
export async function getQuoteSummary(symbol: string) {
  console.debug(`Getting quote for ${symbol}`);

  // Get quotes from Yahoo Finance
  const data = await yahooFinance.quoteSummary(symbol, {
    modules: ['price'],
  });

  if (!data || !data.price || !data.price.regularMarketTime) {
    return;
  }

  const result = {
    symbol: symbol,
    description: data.price.longName,
    currency: data.price.currency,
    exchange: data.price.exchangeName,
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

  const start = new Date(startDate);
  // Yahoo Finance needs next day
  const end = new Date(new Date(endDate).getTime() + 1000 * 60 * 60 * 24);

  // Get quotes from Yahoo Finance
  const data = await yahooFinance.historical(symbol, {
    period1: start.toISOString().substring(0, 10),
    period2: end.toISOString().substring(0, 10),
    includeAdjustedClose: true,
  });

  if (!data) {
    return;
  }

  const result = [];

  // TODO Set type for d
  data.map((d: any) => {
    const date = d.date.toISOString().substring(0, 10);

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
