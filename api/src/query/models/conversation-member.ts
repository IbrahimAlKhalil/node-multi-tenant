import { ConversationMember } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<ConversationMember, 'conversationMember'>({
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
    },
  },
});
