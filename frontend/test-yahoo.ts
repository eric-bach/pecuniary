import YahooFinance from 'yahoo-finance2';
async function test() {
  const yf = new YahooFinance();
  const result = (await yf.quoteSummary('AAPL', { modules: ['assetProfile', 'price'] })) as any;
  console.log(result);
  //const result = await yf.chart('AAPL', { period1: '2024-01-01', period2: '2024-01-05', interval: '1d' });
  //console.log(result.quotes[0]);
}
test();
