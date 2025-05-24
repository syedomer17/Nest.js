// src/mail/mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetLink = `${process.env.BACKEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Password Reset Request',
      html: `
       <p>You requested a password reset.</p>
       <p>Click the link below to reset your password:</p>
       <a href="${resetLink}">Reset your password</a>
       <p>This link will expire in 3 hours.</p>
       <p>If you didn’t request this, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
