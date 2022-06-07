import { defineModel } from '../define-model.js';

export default defineModel<'chatMessage'>({
  kinds: {
    POWER: {
      read: {
        fields: true,
        permission(session) {
          return {
            Conversation: {
              ConversationMembers: {
                some: {
                  userId: session.uid,
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
        preset: {
          deletedAt: new Date(),
        },
      },
    },
    ADMIN: {
      read: true,
      create: {
        fields: 'POWER.read',
        preset: 'POWER.create',
      },
      update: {
        fields: 'POWER.update',
        preset: 'POWER.update',
      },
    },
  },
});
