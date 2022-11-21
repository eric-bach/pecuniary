import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { ulid } from 'ulid';
import config from "../config";
import { getDynamoDBClient } from "../dynamodb/dynamodb-client";
import { Order } from "../generated-sources/openapi/models/Order";

const createOrder = async (order: Order) => {
    if (!order.id) {
        order.id = ulid();
    }
    const dynamodb = await getDynamoDBClient();

    await dynamodb
        .put({
            TableName: config.ORDERS_TABLE_NAME,
            Item: toOrderItem(order) || {},
        })
        .promise();

    return order;
}

const getOrders = async () => {
    const dynamodb = await getDynamoDBClient();
    
    let res: DynamoDB.ScanOutput;
    const items: AttributeMap[] = [];

    do {
        res = await dynamodb
            .scan({
                TableName: config.ORDERS_TABLE_NAME,
            })
            .promise();

        items.push(...res.Items || []);
    } while (res.LastEvaluatedKey);

    const orders = items?.map((item) => {
        console.log(item)
        return fromOrderItem(item)
    }) || [];
    return orders

}

const toOrderItem = (order: Order) => {
    if (!order) return null;

    return {
        id: order.id,
        payload: JSON.stringify(order),
    };
};
const fromOrderItem = (item: AttributeMap) => (item ? (item?.payload as Order) : null);

export { createOrder, getOrders };

