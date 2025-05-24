// app.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class AppController {
  @Get()
  someProtectedRoute(@Req() req: Request) {
    return {
      message: 'Accessed Resource',
      userId: (req.user as any)?._id,
    };
  }
}
