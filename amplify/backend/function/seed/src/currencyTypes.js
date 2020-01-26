module.exports = {
  mutation: `mutation seedCurrencyTypes {
        delete1: deleteCurrencyType(input: { id: "1" }) {
          id
        }
        delete2: deleteCurrencyType(input: { id: "2" }) {
          id
        }
        create1: createCurrencyType(input: {
          id: 1
          name: "CAD"
          description:"Canadian Dollar"
        })
        {
          id
          name
          description
        }
        create2: createCurrencyType(input: {
          id: 2
          name: "USD"
          description:"US Dollar"
        })
        {
          id
          name
          description
        }
      }`
};
