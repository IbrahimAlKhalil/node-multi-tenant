import { ConversationMember } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ConversationMember, 'conversationMember'>({
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
    },
  },
});
