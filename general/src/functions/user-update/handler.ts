import 'source-map-support/register';

import { User } from 'src/@types/index.d';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/user-data-repo';
import schema from './schema';

const createForum: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user: User = event?.body;

  if (user) {
    return (
      formatJSONResponse({
        updated: await repository.update(user),
      })
    );
  }

  return (
    formatJSONResponse({
      updated: false,
    })
  );
};

export const main = middyfy(createForum);
