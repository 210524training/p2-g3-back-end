import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/user-data-repo';

const getChatRoomById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const { id } = event.path;

  if (id) {
    const user = await repository.delete(id);
    return (
      formatJSONResponse({
        user,
      })
    );
  }

  return (
    formatJSONResponse({
      user: null,
    })
  );
};

export const main = middyfy(getChatRoomById);
