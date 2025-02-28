import yahooFinance from 'yahoo-finance2';
import { HistoricalHistoryResult, HistoricalRowHistory } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'yahooFinance' });

// Return the quoteSummary
export async function getQuoteSummary(symbol: string) {
  logger.debug(`Getting quote for ${symbol}`);

  // Get quotes from Yahoo Finance
  // TODO: this is returning ""Unsupported redirect to https://finance.yahoo.com/quote/AAPL/, please report."," and halting the lambda
  // https://github.com/gadicc/node-yahoo-finance2/issues/777
  // Need to fix
  const data = await yahooFinance.quoteSummary(symbol, {
    modules: ['price'],
  });

  logger.debug('🕵️ Returned from YahooFinance quoteSummary()', { data: data });

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

  logger.info('✅ Retrieved quote summary', { data: result });
  return result;
}

// Return historical quote for date range
async function getHistorical(symbol: string, startDate: Date, endDate: Date) {
  logger.debug(`Getting quote for ${symbol} from ${startDate} to ${endDate}`);

  const start = new Date(startDate);
  // Yahoo Finance needs next day
  const end = new Date(new Date(endDate).getTime() + 1000 * 60 * 60 * 24);

  // Get quotes from Yahoo Finance
  const data: HistoricalHistoryResult = await yahooFinance.historical(symbol, {
    period1: start.toISOString().substring(0, 10),
    period2: end.toISOString().substring(0, 10),
    includeAdjustedClose: true,
  });

  if (!data) {
    return;
  }

  const result: HistoricalRowHistory[] = [];

  data.map((d: HistoricalRowHistory) => {
    const date = d.date.toISOString().substring(0, 10);

    logger.debug(`${date}: ${d.close}`);

    result.push({
      date: new Date(date),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      adjClose: d.adjClose,
      volume: d.volume,
    });
  });

  logger.info('✅ Result', { data: result });
  return result;
}
