export enum MimeIdEnum {
  JPEG = 1,
  PNG,
  WEBP,
}

export const MimeTypeMap: {
  [key: number]: string;
} = {
  1: 'image/jpeg',
  2: 'image/png',
  3: 'image/webp',
};
