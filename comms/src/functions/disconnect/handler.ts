import 'source-map-support/register';

import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const def: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event, context) => (
  formatJSONResponse({
    statusCode: 200,
    body: {
      message: 'Hello, world!',
      event,
      context,
    },
  })
);

export const main = middyfy(def);
