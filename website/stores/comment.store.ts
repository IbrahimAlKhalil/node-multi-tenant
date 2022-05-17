import { defineStore } from 'pinia';
import { comment } from '#types/comment-type';

export const useComments = defineStore('comment', {
  state: () => ({
    data: [
      {
        id: '1',
        postId: 1,
        author: {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/300?img=1',
        },
        content: 'This is comment content',
        createdAt: '2020-01-01',
        liked: 10,
        disliked: 1,
        replies: [
          {
            id: 'r1',
            author: {
              name: 'John Doe',
              avatar: 'https://i.pravatar.cc/300?img=2',
            },
            content: 'This is reply comment content',
            createdAt: '2020-01-01',
            liked: 80,
            disliked: 10,
          },
        ],
      },
    ] as comment[],
  }),
  actions: {
    addComment(payload: comment) {
      this.data.push(payload);
    },
    addLike(id: string) {
      if (id.charAt(0) === 'r') {
        this.data.forEach((comment) => {
          comment.replies.forEach((reply) => {
            if (reply.id === id) {
              reply.liked++;
            }
          });
        });
      } else {
        this.data.forEach((comment) => {
          if (comment.id === id) {
            comment.liked++;
          }
        });
      }
    },
    removeLike(id: string) {
      if (id.charAt(0) === 'r') {
        this.data.forEach((comment) => {
          comment.replies.forEach((reply) => {
            if (reply.id === id) {
              reply.liked--;
            }
          });
        });
      } else {
        this.data.forEach((comment) => {
          if (comment.id === id) {
            comment.liked--;
          }
        });
      }
    },
    addDislike(id: string) {
      if (id.charAt(0) === 'r') {
        this.data.forEach((comment) => {
          comment.replies.forEach((reply) => {
            if (reply.id === id) {
              reply.disliked++;
            }
          });
        });
      } else {
        this.data.forEach((comment) => {
          if (comment.id === id) {
            comment.disliked++;
          }
        });
      }
    },
    removeDislike(id: string) {
      if (id.charAt(0) === 'r') {
        this.data.forEach((comment) => {
          comment.replies.forEach((reply) => {
            if (reply.id === id) {
              reply.disliked--;
            }
          });
        });
      } else {
        this.data.forEach((comment) => {
          if (comment.id === id) {
            comment.disliked--;
          }
        });
      }
    },
  },
});
