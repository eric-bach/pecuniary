module.exports = {
  mutation: `mutation seedTransactionTypes {
          delete1: deleteTransactionType(input: { id: "1" }) {
            id
          }
          delete2: deleteTransactionType(input: { id: "2" }) {
            id
          }
          create1: createTransactionType(input: {
            id: 1
            name: "Buy"
            description:"Buy"
          })
          {
            id
            name
            description
          }
          create2: createTransactionType(input: {
            id: 2
            name: "Sell"
            description:"Sell"
          })
          {
            id
            name
            description
          }
        }`
};
