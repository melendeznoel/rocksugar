import {handler} from '../src/index';
import {APIGatewayProxyEvent} from 'aws-lambda';
import {strictEqual} from 'node:assert'
import {describe, it} from 'node:test'

describe('Lambda Handler', () => {
    it('should return a 200 status code and a message', async () => {
        const event: APIGatewayProxyEvent = {} as any; // Mock event
        const result = await handler(event);
        strictEqual(result.statusCode, 200);
        const body = JSON.parse(result.body);
        strictEqual(body.message, 'Hello from Lambda!');
    });
});