import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * EventBusService - Internal event bus wrapping NestJS EventEmitter.
 * Bridges internal events to WebSocket gateway for real-time client updates.
 */
@Injectable()
export class EventBusService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(event: string, data: unknown) {
    this.eventEmitter.emit(event, data);
  }

  on(event: string, handler: (data: unknown) => void) {
    this.eventEmitter.on(event, handler);
  }
}
