import { DynamoDBClient, DescribeTableCommand, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { logger } from "./logging"
import { marshall } from "@aws-sdk/util-dynamodb"
import { set, chain, get } from 'lodash'

let dynamoDbClientInstance: DynamoDBClient

/**
 * Maps a record to a DynamoDB record.
 *
 * @param record - The record to be mapped.
 * @returns The mapped DynamoDB record.
 * @throws If there is an error mapping the record.
 */
export const mapRecordToDynamoDbRecord = (record: Record<string, any>): Record<string, any> => {
    try {
        const result = marshall(record)

        logger.info('Record mapped to DynamoDB record', { data: { record, result } })

        return result
    } catch (error) {
        logger.error('Error mapping record to DynamoDB record', { data: { error } })

        throw error
    }
}

/**
 * Retrieves an instance of DynamoDBClient.
 *
 * @returns {DynamoDBClient} The DynamoDBClient instance.
 * @throws {Error} If there is an error getting the DynamoDB Client Instance.
 */
export const getDynamoDbClientInstance = (): DynamoDBClient => {
    try {
        if (!dynamoDbClientInstance) dynamoDbClientInstance = new DynamoDBClient({ region: process.env.AWS_REGION })

        return dynamoDbClientInstance
    } catch (error) {
        logger.error('Error getting DynamoDB Client Instance', { data: { error } })

        throw error
    }
}

/**
 * Checks if a table exists in DynamoDB.
 *
 * @param dynamoDbClient - The DynamoDB client.
 * @param tableName - The name of the table to check.
 * @returns A promise that resolves to a boolean indicating whether the table exists or not.
 */
export const tableExists = async (dynamoDbClient: DynamoDBClient, tableName: string): Promise<boolean> => {
    try {
        const command = new DescribeTableCommand({ TableName: tableName })

        await dynamoDbClient.send(command)

        return true
    } catch (error: any) {
        logger.error('Error checking if table exists', { data: { error } })

        if (error.message === "ResourceNotFoundException") return false

        throw error
    }
}

/**
 * Maps the search natural keys to the key condition expression and expression attribute values.
 *
 * @param searchNaturalKeys - The search natural keys to be mapped.
 * @returns The mapped key condition expression and expression attribute values.
 */
export const mapQueryKeysAndAttributes = (searchNaturalKeys: Record<string, any>): Record<string, any> => {
    const keyConditionExpression = chain(searchNaturalKeys)
        .keys()
        .map((key) => {
            return `${key} = :${key}`
        })
        .join(' AND ')
        .value()

    const expressionAttributeValues = chain(searchNaturalKeys)
        .keys()
        .reduce((acc, key) => set(acc, `:${key}`, searchNaturalKeys[key]), {})
        .value();

    return {
        keyConditionExpression,
        expressionAttributeValues
    }
}

/**
 * Searches records in a DynamoDB table based on the provided search criteria.
 *
 * @param dynamoDbClient - The DynamoDB client used to execute the search.
 * @param tableName - The name of the table to search records in.
 * @param searchNaturalKeys - The search criteria represented as a key-value pair object.
 * @returns A promise that resolves to the retrieved records.
 * @throws If there is an error retrieving the records.
 */
export const searchRecords = async (dynamoDbClient: DynamoDBClient, tableName: string, searchNaturalKeys: Record<string, any>): Promise<Record<string, any>> => {
    try {
        const identifierValue = get(searchNaturalKeys, 'sku')

        const scanCommandInput: ScanCommandInput = {
            TableName: tableName,
            FilterExpression: "contains(#identifier, :identifierObj)",
            ExpressionAttributeNames: {
                "#identifier": "identifier"
            },
            ExpressionAttributeValues: {
                ":identifierObj": {
                    "S": "SW 7008"
                }
            }
        }

        logger.info('Search Parameters', { data: { scanCommandInput } })

        const command = new ScanCommand(scanCommandInput)

        const result = await dynamoDbClient.send(command)

        logger.info('Records Retrieved', { data: { result } })

        return result
    } catch (error: any) {
        logger.error('Error Retrieving Records', error)

        throw error
    }
}