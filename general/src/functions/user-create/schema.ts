export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    contacts: { type: 'array' },
    chatRoomIds: { type: 'array' },
  },
  required: [
    'id',
    'username',
    'contacts',
    'chatRoomIds',
  ],
} as const;
