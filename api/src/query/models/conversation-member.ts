import { defineModel } from '../define-model.js';

export default defineModel<'conversationMember'>({
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
    },
  },
});
