import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
          limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
        },
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [ImageController],
  providers: [
    ImageService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ImageModule {}
