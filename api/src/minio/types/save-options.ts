import { File, Prisma } from '../../../prisma/client';
import { ImageMimeType } from '../mime-type.enum.js';
import { Folder } from '../folder';
import { Duplex } from 'stream';

export interface SaveOptions {
  folder?: Folder;
  transformer?: Duplex;
  remove?: string | null;
  mimeTypes?: Set<ImageMimeType>;
  size?: number;
  beforeTrxClose?: (trx: Prisma.TransactionClient, file: File) => any;
}
