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
      create: {
        fields: new Set(['conversationId', 'userId']),
        validation(session) {
          return {
            OR: [
              {
                Conversation: {
                  ConversationMembers: {
                    some: {
                      // TODO: Fix this, this condition may allow a user invite themselves to a conversation when they are not supposed to
                      userId: session.uid,
                    },
                  },
                  OR: {
                    inviteOnly: false,
                    canMemberInvite: true,
                  },
                },
              },
              {
                Conversation: {
                  inviteOnly: false,
                },
                userId: session.uid,
              },
            ],
          };
        },
      },
      update: {
        fields: new Set(['lastRead']),
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
        preset(session, data) {
          if (data.lastRead) {
            return {
              lastRead: new Date(),
            };
          }
        },
      },
    },
  },
});
