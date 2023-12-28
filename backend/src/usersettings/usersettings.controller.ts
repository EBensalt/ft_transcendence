import { Controller, UseFilters, UseGuards, Req, Post, Body, HttpCode, UseInterceptors, UploadedFile, HttpStatus, ParseFilePipeBuilder, PayloadTooLargeException } from '@nestjs/common';
import JwtTwoFaGuard from 'src/auth/guard/twoFaAuth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersettingsService } from './usersettings.service';
import { JwtGuard } from 'src/auth/guard';
import { createWriteStream } from 'fs';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('settings')
@UseGuards(JwtTwoFaGuard)
export class UsersettingsController {
    constructor(private userSetService: UsersettingsService) {}


    @Post('name')
    @UseGuards(JwtTwoFaGuard)
    @HttpCode(201)    
    async editUsername(@Req() req, @Body() Name) {
        await this.userSetService.updateUsername(req.user, Name.uniqueName);   
    }
    @Post('avatar')
    @UseGuards(JwtTwoFaGuard)
    @HttpCode(201)
    async editAvatar(@Req() req, @Body() body) {
        const avatar: string = body.avatar;
        console.log(avatar.length);
        // if (avatar.length > 100000)
        //    throw HttpStatus.PAYLOAD_TOO_LARGE;
      await this.userSetService.updateAvater(req.user.id, body.avatar);
    }
}
