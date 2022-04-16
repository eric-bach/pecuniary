# Version 2

```
mutation CreateAccount {
  createAccount(createAccountInput: {
    userId: "eric"
		type: "TFSA"
    name: "Test"
    description: "Test Account"
  })
  {
    userId
    aggregateId
    entity
    type
    name
    description
    createdAt
    updatedAt
  }
}

mutation DeleteAccount {
  deleteAccount(deleteAccountInput: {
    userId: "eric"
    aggregateId: "acc4fc07-46e9-4ae2-9bff-490c4f4742e5"
  }) {
    aggregateId
  }
}

mutation UpdateAccount {
  updateAccount(updateAccountInput: {
    userId: "eric"
    aggregateId: "acc4fc07-46e9-4ae2-9bff-490c4f4742e5"
    type: "RRSP"
    name: "Test"
    description:"My description"
  })
  {
    aggregateId
    type
    name
    description
  }
}

mutation CreateTransaction {
	createTransaction(createTransactionInput:{
    userId: "eric"
    aggregateId:"a0c41702-0d14-4a96-895f-45c52da87dac"
		type: "Buy"
    transactionDate: "2022-04-11"
    symbol: "AAPL"
    shares: 100
    price: 124.88
    commission: 4.99
    exchange: "NYSE"
    currency: "USD"
  })
  {
    aggregateId
    entity
    symbol
    shares
    price
    commission
  }
}

mutation UpdateTransaction {
	updateTransaction(updateTransactionInput:{
    userId: "eric"
    createdAt: "2022-04-15T21:49:58.143Z"
    aggregateId:"a0c41702-0d14-4a96-895f-45c52da87dac"
		type: "Buy"
    transactionDate: "2022-04-11"
    symbol: "AAPL"
    shares: 100
    price: 200.00
    commission: 4.99
    exchange: "NYSE"
    currency: "USD"
  })
  {
    aggregateId
    entity
    symbol
    shares
    price
    commission
  }
}

mutation DeleteTransaction {
  deleteTransaction(deleteTransactionInput:{
    userId: "eric"
    createdAt: "2022-04-15T21:49:58.143Z"
    aggregateId:"a0c41702-0d14-4a96-895f-45c52da87dac"
  })
  {
    aggregateId
  }
}

query GetAccounts {
  getAccounts(userId:"eric")
  {
    aggregateId
    name
    type
    description
  }
}

query GetTransactions {
  getTransactions(
    userId :"eric"
    aggregateId:"36b20b9f-b28b-406c-9aa0-0300e8a9b55b"
  )
  {
    aggregateId
    entity
    type
    transactionDate
    symbol
    shares
    price
    commission
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
