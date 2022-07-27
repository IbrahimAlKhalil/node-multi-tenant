import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class Minio extends Client {}
