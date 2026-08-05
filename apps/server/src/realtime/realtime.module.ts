import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsGateway } from './events.gateway';
import { EventBusService } from './event-bus.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ':',
    }),
  ],
  providers: [EventsGateway, EventBusService],
  exports: [EventsGateway, EventBusService],
})
export class RealtimeModule {}
