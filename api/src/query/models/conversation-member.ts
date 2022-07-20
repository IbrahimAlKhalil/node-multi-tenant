import { defineModel } from '../define-model.js';

export default defineModel<'conversationMember'>({
  access: {
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
        permission: {
          include: new Set(['conversationId']),
          value(session) {
            return {
              OR: [
                {
                  Conversation: {
                    ConversationMembers: {
                      some: {
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
