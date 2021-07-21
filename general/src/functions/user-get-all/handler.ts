import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/user-data-repo';
import { User } from 'src/@types/index.d';

const getAllChatRooms: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const users: User[] = await repository.getAll();
  return (
    formatJSONResponse({
      users,
    })
  );
};

export const main = middyfy(getAllChatRooms);
