import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import repository from '@libs/repositories/chat-room-repository';
import { ChatRoom } from 'src/@types';

const getAllChatRooms: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const chatRooms: ChatRoom[] = await repository.getAll();
  return (
    formatJSONResponse({
      chatRooms,
    })
  );
};

export const main = middyfy(getAllChatRooms);
