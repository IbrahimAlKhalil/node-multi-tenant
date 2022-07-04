export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  pictureId: string | null;
  type: 'ADMIN' | 'STUDENT' | 'GUARDIAN' | 'STAFF' | 'SUPPORTER' | 'GENERAL';
}
