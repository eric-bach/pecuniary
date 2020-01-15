module.exports = {
  mutation: `mutation createCurrencyType {
        createCurrencyType(input: {
        id: 1
        name: "Test",
        description: "Test"
        }) {
        id
        name
        description
        }
    }`
};
