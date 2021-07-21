import 'source-map-support/register';

import { ChatRoom } from 'src/@types/index.d';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/chat-room-repository';
import schema from './schema';

const createForum: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  const chatRoom: ChatRoom = event?.body;

  if (chatRoom) {
    return (
      formatJSONResponse({
        created: await repository.update(chatRoom),
      })
    );
  }

  return (
    formatJSONResponse({
      created: false,
    })
  );
};

export const main = middyfy(createForum);
