import { ChatFile } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ChatFile, 'chatFile'>({
  kinds: {
    POWER: {
      read: {
        fields: true,
        permission(session) {
          return {
            where: {
              Chat: {
                userId: session.uid,
              },
            },
          };
        },
      },
    },
  },
});
