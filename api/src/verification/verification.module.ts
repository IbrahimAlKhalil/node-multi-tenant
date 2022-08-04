import { VerificationService } from './verification.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [VerificationService],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
