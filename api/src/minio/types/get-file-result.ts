import { File } from '../../../prisma/client';
import { BucketItemStat } from 'minio';
import { Readable } from 'stream';

export interface GetFileResult {
  stat: BucketItemStat;
  fileInDB: File;
  stream: Readable;
}
