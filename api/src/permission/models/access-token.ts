import { AccessToken } from '../../../prisma/client';
import { defineModel } from '../define-model.js';

export default defineModel<AccessToken, 'accessToken'>({
  kinds: {
    ALL: {
      read: {
        fields: true,
        permissions(session) {
          return {
            where: {
              userId: session.uid,
            },
          };
        },
      },
      delete: {
        permissions: 'ALL.read',
      },
    },
  },
});
