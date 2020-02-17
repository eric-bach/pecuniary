//https://dev.to/akanksha_9560/why-not-to-use-setinterval--2na9
export const setIntervalAsync = (fn, ms) => {
  fn().then(() => {
    setTimeout(() => setIntervalAsync(fn, ms), ms);
  });
};
