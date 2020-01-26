module.exports = {
  mutation: `mutation seedExchangeTypes {
          delete1: deleteExchangeType(input: { id: "1" }) {
            id
          }
          delete2: deleteExchangeType(input: { id: "2" }) {
            id
          }
          delete3: deleteExchangeType(input: { id: "2" }) {
            id
          }
          create1: createExchangeType(input: {
            id: 1
            name: "TSX"
            description:"Toronto Stock Exchange"
            exchangeTypeCurrencyTypeId: 1
          })
          {
            id
            name
            description
          }
          create2: createExchangeType(input: {
            id: 2
            name: "NYSE"
            description:"New York Stock Exchange"
            exchangeTypeCurrencyTypeId: 2
          })
          {
            id
            name
            description
          }
          create3: createExchangeType(input: {
            id: 3
            name: "NASDAQ"
            description:"NASDAQ"
            exchangeTypeCurrencyTypeId: 2
          })
          {
            id
            name
            description
          }
        }`
};
