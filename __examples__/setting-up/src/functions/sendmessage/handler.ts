import 'source-map-support/register';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const ddb = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const { TABLE_NAME } = process.env;

const sendMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  let connectionData: DynamoDB.DocumentClient.ScanOutput;
  
  try {
    const ddbScanParams: DynamoDB.DocumentClient.ScanInput = { 
      TableName: TABLE_NAME, 
      ProjectionExpression: 'connectionId' 
    };
    connectionData = await ddb.scan(ddbScanParams).promise();
  } catch (e) {
    return formatJSONResponse({ 
      statusCode: 500, 
      body: e.stack 
    });
  }

  const config: ApiGatewayManagementApi.ClientConfiguration = {
    apiVersion: 'latest',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  };
  
  const apigwManagementApi = new ApiGatewayManagementApi(config);

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      const params: ApiGatewayManagementApi.PostToConnectionRequest = {
        ConnectionId: connectionId, 
        Data: event.body
      };
      await apigwManagementApi.postToConnection(params).promise();
    } catch (e: any) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        const ddbDeleteParams: DynamoDB.DocumentClient.DeleteItemInput = {
          TableName: TABLE_NAME, 
          Key: { 
            connectionId 
          }
        };
        await ddb.delete(ddbDeleteParams).promise();
      } else {
        throw e;
      }
    }
  });
  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, body: e.stack });
  }

  return formatJSONResponse({ statusCode: 200, body: 'Data sent.' });
};

export const main = middyfy(sendMessage);