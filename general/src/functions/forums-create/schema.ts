export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    tags: { type: 'List<string>' },
    username: { type: 'string' },
    createdAt: { type: 'string' },
    content: { type: 'string' },
    likes: { type: 'number' },
    numberOfComments: { type: 'number' },
    comments: { type: 'List<object>' },

  },
  required: [
    'id',
    'title',
    'tags',
    'username',
    'createdAt',
    'content',
  ],
} as const;
