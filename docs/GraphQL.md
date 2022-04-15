# Version 2

```
mutation CreateAccount {
  createAccount(createAccountInput: {
    name: "Test"
    description: "Test Account"
    userId: "eric"
    accountTypeId: 1
    accountTypeName: "TFSA"
    accountTypeDescription: "Tax Free Savings Account"
  })
  {
    id
    aggregateId
    version
    name
    description
  }
}

mutation UpdateAccount {
  updateAccount(updateAccountInput: {
    id: "6e215222-f26a-42b0-a283-bf273900c75f"
    version: 1
    name: "New Name"
    description: "New Account"
    bookValue: 0
    marketValue: 0
    userId: "eric"
    accountTypeId: 1
    accountTypeName:"TFSA"
    accountTypeDescription: "Tax Free Savings Account"
  })
  {
    id
    aggregateId
    version
    name
    description
  }
}

mutation DeleteAccount {
  deleteAccount(deleteAccountInput: {
    id: "6e215222-f26a-42b0-a283-bf273900c75f"
    aggregateId: "b9fa6509-ff9d-4c5c-82d0-42fa8792425b"
    userId:"eric"
  })
  {
    id
  }
}

mutation CreateTransaction {
  createTransaction(createTransactionInput: {
    accountId: "4d0f9f8c-6418-415d-8869-5f1475eabbba"
    aggregateId: "b9fa6509-ff9d-4c5c-82d0-42fa8792425b"
    userId: "eric"
    transactionDate: "2022-04-11Z"
    symbol: "AAPL"
    shares: 500
    price: 124.88
    commission: 5.49
    transactionTypeId: 1
    transactionTypeName: "Buy"
    transactionTypeDescription: "Buy"
  })
  {
    id
    aggregateId
  	symbol
    shares
    price
    commission
  }
}

mutation UpdateTransaction {
  updateTransaction(updateTransactionInput: {
    id: "72f530de-4e1f-4f4b-831e-a5c3a4c8aff3"
    version: 2
    accountId: "4d0f9f8c-6418-415d-8869-5f1475eabbba"
    aggregateId: "b9fa6509-ff9d-4c5c-82d0-42fa8792425b"
    userId: "eric"
    transactionDate: "2022-04-11"
    symbol: "AAPL"
    shares: 999
    price: 123.55
    commission: 5.49
    transactionTypeId: 1
    transactionTypeName: "Buy"
    transactionTypeDescription: "Buy"
  })
  {
    id
    aggregateId
  	symbol
    shares
    price
    commission
  }
}

mutation DeleteTransaction {
  deleteTransaction(deleteTransactionInput: {
    id: "33b42177-8700-4a01-8844-b37ba6f813f8"
    aggregateId: "b9fa6509-ff9d-4c5c-82d0-42fa8792425b"
   	userId:"eric"
  })
  {
    id
  }
}
```

# Queries and Mutations

```
query ListAccountTypes {
  listAccountTypes {
    id
    name
    description
  }
}

query GetPositions {
  getPositionsByAccountId(accountId: "905e90ab-0cb5-4517-babd-876c7c3ab017") {
    id
    name
    symbol
    description
    exchange
    currency
    country
    shares
  }
}

query GetTransactions {
  getTransactionsByAccountId(accountId: "905e90ab-0cb5-4517-babd-876c7c3ab017") {
    id
    symbol
    price
    shares
    commission
  }
}

query listEvents {
  listEvents {
    items {
      id
      name
    }
  }
}

query GetAccountByAggregateId {
  getAccountByAggregateId(aggregateId: "d70f5eb9-ecc9-4a79-b145-4ac7d327e38e") {
    id
    name
    description
    userId
  }
}

query GetAccountsByUser {
  getAccountsByUser(userId: "eric") {
   	id
    name
    description
    bookValue
    marketValue
   	accountType {
     	id
      name
   	}
  }
}

mutation CreateAccount($createAccountInput: CreateEventInput!) {
	createEvent(event: $createAccountInput) {
		id
		aggregateId
		name
		version
		data
		userId
		createdAt
	}
}

mutation UpdateAccount($updateAccountInput: CreateEventInput!) {
  createEvent(event: $updateAccountInput) {
    id
		aggregateId
		name
		version
		data
		userId
		createdAt
  }
}

mutation DeleteAccount($deleteAccountInput: CreateEventInput!) {
	createEvent(event: $deleteAccountInput) {
		id
		aggregateId
		name
		version
		data
		userId
		createdAt
	}
}

mutation CreateTransaction($createTransactionInput: CreateEventInput!) {
  createEvent(event: $createTransactionInput) {
    id
		aggregateId
		name
		version
		data
		userId
		createdAt
  }
}

mutation UpdateTransaction($updateTransactionInput: CreateEventInput!) {
  createEvent(event: $updateTransactionInput) {
    id
		aggregateId
		name
		version
		data
		userId
		createdAt
  }
}

mutation DeleteTransaction($deleteTransactionInput: CreateEventInput!) {
  createEvent(event: $deleteTransactionInput) {
    id
		aggregateId
		name
		version
		data
		userId
		createdAt
  }
}
```

# Query Variables

```
{
	"createAccountInput": {
        "aggregateId": "1",
        "name": "AccountCreatedEvent",
        "version": 1,
        "data": "{\"name\":\"New Account\",\"description\":\"RRSP Account\",\"bookValue\":0,\"marketValue\":0,\"accountType\":{\"id\":1,\"name\":\"TFSA\",\"description\":\"Tax Free Savings Account\"}}",
        "userId": "eric",
        "createdAt": "2020-02-18T00:00:00Z"
  },
  "updateAccountInput": {
      "aggregateId": "1",
      "name": "AccountUpdatedEvent",
      "version": 2,
      "data": "{\"id\":\"df169036-bcd4-4338-b909-92ab7f53f814\",\"name\":\"Eric Account\",\"description\":\"RRSP Account\",\"bookValue\":0,\"marketValue\":0,\"accountType\":{\"id\":1,\"name\":\"TFSA\",\"description\":\"Tax Free Savings Account\"}}",
      "userId": "eric",
      "createdAt": "2020-02-22T00:00:00Z"
  },
  "deleteAccountInput": {
      "aggregateId": "1",
      "name": "AccountDeletedEvent",
      "version": 3,
    	"data": "{\"id\":\"374c96f7-59a4-4b3e-8b5e-cf4283df8480\",\"name\":\"New Account\",\"description\":\"Updated RRSP Account\",\"accountType\":{\"id\":1,\"name\":\"TFSA\",\"description\":\"Tax Free Savings Account\"}}",
      "userId": "eric",
      "createdAt": "2020-02-22T00:00:00Z"
  },
  "createTransactionInput": {
        "aggregateId": "1",
        "name": "TransactionCreatedEvent",
        "version": 1,
        "data": "{\"accountId\":\"71b48a39-2c9a-4b3a-aa0f-a5ed50c559b9\",\"transactionDate\":\"2021-08-31Z\",\"shares\":100,\"price\":80.00,\"commission\":4.50,\"symbol\":\"BMO.TO\",\"transactionType\":{\"id\":1,\"name\":\"Buy\",\"description\":\"Buy\"}}",
        "userId": "eric",
        "createdAt": "2020-02-18T00:00:00Z"
  },
  "updateTransactionInput": {
        "aggregateId": "1",
        "name": "TransactionUpdatedEvent",
        "version": 2,
        "data": "{\"id\":\"7d4afdfb-2599-41b3-83a3-0cb23ea946cd\",\"accountId\":\"374c96f7-59a4-4b3e-8b5e-cf4283df8480\",\"transactionDate\":\"2020-02-14Z\",\"shares\":999,\"price\":80.00,\"commission\":4.50,\"symbol\":\"BMO.TO\",\"transactionType\":{\"id\":1,\"name\":\"Buy\",\"description\":\"Buy\"}}",
        "userId": "eric",
        "createdAt": "2020-11-14T00:00:00Z"
  },
   "deleteTransactionInput": {
        "aggregateId": "1",
        "version": 3,
        "name": "TransactionDeletedEvent",
        "data": "{\"id\":\"7d4afdfb-2599-41b3-83a3-0cb23ea946cd\"}",
        "userId": "eric",
        "createdAt": "2020-02-28T00:00:00Z"
    }
}
```
