import { ChatFile } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ChatFile, 'chatFile'>({
  roles: {
    POWER: {
      read: {
        fields: true,
        permissions(session) {
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
