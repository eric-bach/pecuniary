import boto3
from yahooquery import Ticker

ddb_client = boto3.client("dynamodb")

def handler(event, context):
    detail = event["detail"]
    print("🚀 Event detail", detail)

    symbol = detail["symbol"]

    # Call yahoofinance to get quote for symbol
    ticker = get_quote(symbol)

    # Update exchange, currency, and calculate market value
    detail['exchange'] = ticker['exchangeName']
    detail['currency'] = ticker['currency']
    detail['price'] = ticker['regularMarketPrice']

    print(detail)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
        "body": detail,
    }

def get_quote(symbol):
    ticker = Ticker(symbol)

    print(ticker)
    
    return {
        "statusCode": 200,
        "body": ticker,
    }