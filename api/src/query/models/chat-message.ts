import { defineModel } from '../define-model.js';
import { ChatMessage } from '../../../prisma/client';

export default defineModel<ChatMessage, 'chatMessage'>({
  kinds: {
    POWER: {
      read: {
        fields: true,
        permissions(session) {
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
        permissions: 'POWER.read',
        presets(session) {
          return {
            userId: session.uid,
          };
        },
      },
      update: {
        fields: new Set(),
        presets() {
          return {
            deletedAt: new Date(),
          };
        },
      },
    },
  },
});
