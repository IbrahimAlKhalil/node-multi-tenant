import { ChatMessage } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ChatMessage, 'chatMessage'>({
  kinds: {
    POWER: {
      read: {
        fields: true,
        permission(session) {
          return {
            where: {
              Conversation: {
                ConversationMembers: {
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
        validation: 'POWER.read',
        preset(session) {
          return {
            userId: session.uid,
          };
        },
      },
      update: {
        fields: new Set(),
        preset() {
          return {
            deletedAt: new Date(),
          };
        },
      },
    },
  },
});
