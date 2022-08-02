import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { AssetService } from '../asset/asset.service.js';
import { JobMailData } from './types/job-mail-data';
import { MailService } from './mail.service.js';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('mail')
export class MailProcessor {
  constructor(
    private readonly assetService: AssetService,
    private readonly mailService: MailService,
  ) {}

  private readonly logger = new Logger(MailProcessor.name);

  @Process()
  private async send(job: Job<JobMailData>) {
    const html = await this.assetService.getMjml(job.data.template, job.data);

    await job.progress(50);

    try {
      await this.mailService.sendMail({
        subject: job.data.subject,
        from: job.data.from,
        to: job.data.to,
        html,
      });
    } catch (e) {
      this.logger.error(e);
      await job.takeLock();
      await job.progress(0);
      await job.moveToFailed(e.message);
    }

    await job.progress(100);
    await job.moveToCompleted();
    await job.releaseLock();
  }

  @OnQueueActive()
  private onActive(job: Job<JobMailData>) {
    this.logger.log(
      `Sending ${job.data.template} to ${job.data.to} using ${
        job.data.from
      } with ${JSON.stringify(job.data.variables)}`,
    );
  }

  @OnQueueFailed()
  private onFailed(job: Job<JobMailData>, err: any) {
    this.logger.error(
      `${err.message}\nSending ${job.data.template} to ${job.data.to} using ${
        job.data.from
      } with ${JSON.stringify(job.data.variables)}`,
    );
  }
}
