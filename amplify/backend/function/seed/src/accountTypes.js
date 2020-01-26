module.exports = {
  mutation: `mutation seedAccountTypes {
          delete1: deleteAccountType(input: { id: "1" }) {
            id
          }
          delete2: deleteAccountType(input: { id: "2" }) {
            id
          }
          create1: createAccountType(input: {
            id: 1
            name: "TFSA"
            description:"Tax Free Savings Account"
          })
          {
            id
            name
            description
          }
          create2: createAccountType(input: {
            id: 2
            name: "RRSP"
            description:"Registered Retirement Savings Account"
          })
          {
            id
            name
            description
          }
        }`
};
