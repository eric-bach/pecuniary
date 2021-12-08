# Login AWS SSO
# aws sso login

# Build Backend
echo 'Build backend...'
npm run build

# Build Client
echo 'Build client...'
npm run build --prefix ../client

# Deploy CDK
echo 'Deploy CDK backend...'
cdk deploy --profile 524849261220_AdministratorAccess pecuniary-dev --require-approval=never

# Populate seed values
echo 'Seed database...'
aws dynamodb put-item --table-name pecuniary-AccountType-dev --item file://seed-data/AccountType1.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-AccountType-dev --item file://seed-data/AccountType2.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-CurrencyType-dev --item file://seed-data/CurrencyType1.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-CurrencyType-dev --item file://seed-data/CurrencyType2.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-ExchangeType-dev --item file://seed-data/ExchangeType1.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-ExchangeType-dev --item file://seed-data/ExchangeType2.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-ExchangeType-dev --item file://seed-data/ExchangeType3.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-TransactionType-dev --item file://seed-data/TransactionType1.json --profile 524849261220_AdministratorAccess
aws dynamodb put-item --table-name pecuniary-TransactionType-dev --item file://seed-data/TransactionType2.json --profile 524849261220_AdministratorAccess