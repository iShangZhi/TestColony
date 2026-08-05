import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from './events.gateway';
import { EventBusService } from './event-bus.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ':',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'testcolony-dev-jwt-secret'),
      }),
    }),
  ],
  providers: [EventsGateway, EventBusService],
  exports: [EventsGateway, EventBusService],
})
export class RealtimeModule {}
