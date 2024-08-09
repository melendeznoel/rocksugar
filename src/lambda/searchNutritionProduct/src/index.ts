import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { logger} from "./logging"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Search', { data: { event } })

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            input: event,
        }),
    }
    return response
}