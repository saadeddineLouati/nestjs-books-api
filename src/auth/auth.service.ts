import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, firstName, lastName, password } = authCredentialsDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({ email, firstName, lastName, password: hashedPassword });

        try {
            await user.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }

    async signIn(user: User) {
        const payload = { email: user.email, sub: user._id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(pass, user.password);

        if (valid) {
            return user;
        }

        return null;
    }

    async resetPassword(resetToken, userID, password) {
        let updatedUser;
        if (resetToken !== userID) {
            throw new UnauthorizedException('Wrong reset token');
        }
        try {
            updatedUser = await this.userModel.findById(userID).exec();
        } catch (error) {
            throw new NotFoundException('Could not find User.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedUser.password = hashedPassword;
        updatedUser.save();
    }

}
