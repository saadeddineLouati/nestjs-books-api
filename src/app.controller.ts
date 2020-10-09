import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): { welcome: string } {
    return { welcome: 'Hi, You can find the API documentation on /api' };
  }
}
