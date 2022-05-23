import { defineStore } from 'pinia';
import { comment } from '#types/comment-type';

export const useComments = defineStore('comment', {
  state: () => ({
    comments: [
      {
        id: '1',
        postId: 1,
        author: {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/300?img=1',
        },
        content: 'This is comment content',
        createdAt: '2020-01-01',
        reactions: {
          like: 10,
          dislike: 1,
          sad: 0,
          angry: 1,
        },
        replies: [
          {
            id: 'r1',
            author: {
              name: 'John Doe',
              avatar: 'https://i.pravatar.cc/300?img=2',
            },
            content: 'This is reply comment content',
            createdAt: '2020-01-01',
            reactions: {
              like: 10,
              dislike: 1,
              sad: 5,
              angry: 2,
            },
          },
          {
            id: 'r2',
            author: {
              name: 'Another Person',
              avatar: 'https://i.pravatar.cc/300?img=9',
            },
            content: 'This is reply comment content',
            createdAt: '2020-01-01',
            reactions: {
              like: 10,
              dislike: 1,
              sad: 0,
              angry: 0,
            },
          },
        ],
      },
      {
        id: '2',
        postId: 1,
        author: {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/300?img=3',
        },
        content: 'This is comment content',
        createdAt: '2020-01-01',
        reactions: {
          like: 10,
          dislike: 1,
          sad: 0,
          angry: 0,
        },
        replies: [
          {
            id: 'r1',
            author: {
              name: 'John Doe',
              avatar: 'https://i.pravatar.cc/300?img=4',
            },
            content: 'This is reply comment content',
            createdAt: '2020-01-01',
            reactions: {
              like: 10,
              dislike: 1,
              sad: 0,
              angry: 0,
            },
          },
        ],
      },
    ] as comment[],
    suggestions: [
      { id: 1, title: 'Thanks for sharing', postId: 0 },
      { id: 2, title: 'Perfect', postId: 0 },
    ],
  }),
  actions: {
    addComment(payload: comment) {
      this.comments.push(payload);
    },
  },
});
