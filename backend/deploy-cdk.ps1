# ENSURE TO DO THIS
# Login AWS SSO
# cmd.exe /c aws sso login

# Build Lambda
cmd.exe /c npm run build

# Deploy CDK
cmd.exe /c cdk deploy --profile 524849261220_AdministratorAccess pecuniary-dev

# Populate seed values
cmd.exe /c aws dynamodb put-item --table-name pecuniary-AccountType --item file://seed-data/AccountType1.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-AccountType --item file://seed-data/AccountType2.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-CurrencyType --item file://seed-data/CurrencyType1.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-CurrencyType --item file://seed-data/CurrencyType2.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-ExchangeType --item file://seed-data/ExchangeType1.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-ExchangeType --item file://seed-data/ExchangeType2.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-ExchangeType --item file://seed-data/ExchangeType3.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-TransactionType --item file://seed-data/TransactionType1.json
cmd.exe /c aws dynamodb put-item --table-name pecuniary-TransactionType --item file://seed-data/TransactionType2.json