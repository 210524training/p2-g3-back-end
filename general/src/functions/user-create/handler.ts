import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/user-data-repo';

import { User } from 'src/@types/index.d';
import schema from './schema';

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user: User = event?.body;

  if (user) {
    return (
      formatJSONResponse({
        created: await repository.add(user),
      })
    );
  }

  return (
    formatJSONResponse({
      created: false,
    })
  );
};

export const main = middyfy(createUser);
