import * as Lambda from 'aws-lambda';
import OpenAPIBackend, { Context } from 'openapi-backend';
import { Order } from './generated-sources/openapi/models/Order';

import * as orderService from './order/order-services';
export function replyJSON(
    json: unknown,
    opts?: Partial<Lambda.APIGatewayProxyStructuredResultV2>,
): Lambda.APIGatewayProxyStructuredResultV2 {
    const defaultHeaders = {
        'content-type': 'application/json',
        'cache-control': 'no-cache,no-store,must-revalidate',
        expires: '0',
    };

    return {
        isBase64Encoded: false,
        statusCode: 200,
        body: json ? JSON.stringify(json) : '',
        ...opts,
        headers: {
            ...defaultHeaders,
            ...opts?.headers,
        },
    };
}
const api = new OpenAPIBackend({
    definition: "./openapi.yml", quick: true, handlers: {
        createOrder: async (c: Context) => {
            const order = c.request.requestBody as Order
            const createdOrder = await orderService.createOrder(order)
            return createdOrder;
        },
        getOrders: async (c: Context) => {
            // Configure authentication
            const authUser = 'user';
            const authPass = 'pass';

            // Construct the Basic Auth string
            const authString = 'Basic ' + new Buffer(authUser + ':' + authPass).toString('base64');
            if (c?.request?.headers?.authorization === authString) {
                const orders = await orderService.getOrders()
                return { orders };
            } else {
                const body = 'Unauthorized';
                const response = {
                    status: '401',
                    statusDescription: 'Unauthorized',
                    body: body,
                };
                // return response
                return replyJSON(response, { 'statusCode': 401, headers: { 'www-authenticate': 'Basic realm="Restricted"' } })
            }

        },
        notFound: (c: Context) => {
            if (c.request.method === "options") {
                return {
                    statusCode: 200,
                };
            } else {
                return {
                    statusCode: 404,
                    body: "Not found",
                };
            }
        }
    }
});


const handler = async (event: any) => {
    console.log(event)
    return api.handleRequest({
        method: event.requestContext.http.method,
        path: event.requestContext.http.path,
        query: event.queryStringParameters,
        body: event.body,
        headers: event.headers,
    });
};

export { handler };
