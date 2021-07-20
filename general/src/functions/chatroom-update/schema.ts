export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    users: { type: 'array' },
    messages: { type: 'array' },
    lastMessage: { type: 'object' },
  },
  required: [
    'id',
    'title',
    'users',
    'messages',
    'lastMessage',
  ],
} as const;
