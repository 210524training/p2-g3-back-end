import 'source-map-support/register';
import { DynamoDB } from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const ddb = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

const { TABLE_NAME } = process.env;

const disconnect: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const putParams: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId,
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return formatJSONResponse({
      statusCode: 500,
      body: `Failed to connect: ${JSON.stringify(err)}`,
    });
  }

  return formatJSONResponse({
    statusCode: 200,
    body: 'Connected.',
  });
};

export const main = middyfy(disconnect);
