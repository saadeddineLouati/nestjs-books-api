import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    ): Promise<void> {
        return await this.authService.signUp(authCredentialsDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signIn(@Request() req) {
        return this.authService.signIn(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req) {
        return req.user;
    }

    @Post('forgot')
    forgot(
        @Body('email') email: string,
    ) {
        return this.authService.forgot(email);
    }

    @Post('reset')
    resetPassword(
        @Body('resetToken') resetToken: string,
        @Body('newPassword') newPassword: string,
    ) {
        return this.authService.resetPassword(resetToken, newPassword);
    }
}
