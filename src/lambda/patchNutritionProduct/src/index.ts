import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { logger} from "./logging"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id }  = event.pathParameters || {}

    logger.info('Search', { data: { event, id } })

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            input: event,
        }),
    }
    return response
}