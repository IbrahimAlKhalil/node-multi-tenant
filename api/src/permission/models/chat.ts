import { defineModel } from '../define-model.js';
import { Chat } from '../../../prisma/client';

export default defineModel<Chat, 'chat'>({
  kinds: {
    POWER: {
      read: {
        fields: true,
        permissions(session) {
          return {
            where: {
              Conversation: {
                ConversationMember: {
                  some: {
                    userId: session.uid,
                  },
                },
              },
            },
          };
        },
      },
      create: {
        fields: new Set(['id', 'conversationId', 'parentId', 'message']),
        permissions: 'POWER.read',
        presets(session) {
          return {
            userId: session.uid,
          };
        },
      },
      update: {
        fields: false,
        presets() {
          return {
            deletedAt: new Date(),
          };
        },
      },
    },
  },
});
