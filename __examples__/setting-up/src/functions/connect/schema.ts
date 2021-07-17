export default {
  type: "object",
  properties: {
    username: { type: 'string' },
    message: { type: 'string'},
  },
  required: ['username', 'message']
} as const;
