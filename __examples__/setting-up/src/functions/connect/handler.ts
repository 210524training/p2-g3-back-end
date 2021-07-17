import 'source-map-support/register';
import { DynamoDB } from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';


const ddb = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const { TABLE_NAME } = process.env;

const disconnect: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event, context) => {
  console.log(event);
  console.log(context);
  const deleteParams: DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    return { 
      statusCode: 500, 
      body: 'Failed to disconnect: ' + JSON.stringify(err) 
    };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};

export const main = middyfy(disconnect);
