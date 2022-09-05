///<reference types="react" />

declare module 'marketing/MarketingApp' {
  export { mount };
}

declare module 'finance/FinanceApp' {
  export { mount };
}

declare module 'auth/AuthApp' {
  export { mount };
}

declare module 'app2/CounterAppTwo' {
  const CounterAppTwo: React.ComponentType;

  export default CounterAppTwo;
}
