import { AccessToken } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<AccessToken, 'accessToken'>({
  kinds: {
    ALL: {
      read: {
        fields: true,
        permission(session) {
          return {
            where: {
              userId: session.uid,
            },
          };
        },
      },
      delete: {
        permission: 'ALL.read',
      },
    },
  },
});
