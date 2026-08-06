import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * EventsGateway - Socket.IO gateway for real-time communication.
 * Bridges internal EventEmitter events to WebSocket clients.
 * Rooms: sessions, test runs, interactions.
 */
@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // Bridge internal events to WebSocket
    this.setupEventBridge();
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token as string);
      (client as any).user = payload;
      this.logger.log(`Client connected: ${client.id} (user: ${payload.email})`);
    } catch (err: any) {
      this.logger.warn(`Auth failed for client ${client.id}: ${err.message}`);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('session:join')
  handleSessionJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { sessionId: string }) {
    client.join(`session:${data.sessionId}`);
    this.logger.log(`Client ${client.id} joined session:${data.sessionId}`);
  }

  @SubscribeMessage('session:leave')
  handleSessionLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { sessionId: string }) {
    client.leave(`session:${data.sessionId}`);
  }

  @SubscribeMessage('run:join')
  handleRunJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { runId: string }) {
    client.join(`run:${data.runId}`);
    this.logger.log(`Client ${client.id} joined run:${data.runId}`);
  }

  @SubscribeMessage('run:leave')
  handleRunLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { runId: string }) {
    client.leave(`run:${data.runId}`);
  }

  @SubscribeMessage('interaction:respond')
  handleInteractionRespond(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { interactionId: string; response: string; userId: string },
  ) {
    this.eventEmitter.emit('interaction:respond', data);
    this.eventEmitter.emit('interaction:responded', data); // Fix: also emit 'responded' for InteractionService
  }

  @SubscribeMessage('interaction:skip')
  handleInteractionSkip(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { interactionId: string },
  ) {
    this.eventEmitter.emit('interaction:skip', data);
  }

  private setupEventBridge() {
    // Bridge session events
    this.eventEmitter.on('session:status', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:status', data);
    });
    this.eventEmitter.on('session:token', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:token', data);
    });
    this.eventEmitter.on('session:tool_start', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:tool_start', data);
    });
    this.eventEmitter.on('session:tool_end', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:tool_end', data);
    });
    this.eventEmitter.on('session:tool_error', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:tool_error', data);
    });
    this.eventEmitter.on('session:interrupted', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:interrupted', data);
    });
    this.eventEmitter.on('session:completed', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('session:completed', data);
    });

    // Bridge sub-agent events
    this.eventEmitter.on('subagent:started', (data: any) => {
      this.server.to(`session:${data.parentSessionId}`).emit('subagent:started', data);
    });
    this.eventEmitter.on('subagent:completed', (data: any) => {
      this.server.to(`session:${data.parentSessionId}`).emit('subagent:completed', data);
    });
    this.eventEmitter.on('subagent:error', (data: any) => {
      this.server.to(`session:${data.parentSessionId}`).emit('subagent:error', data);
    });

    // Bridge execution events
    this.eventEmitter.on('execution:started', (data: any) => {
      this.server.to(`run:${data.runId}`).emit('run:started', data);
    });
    this.eventEmitter.on('execution:progress', (data: any) => {
      this.server.to(`run:${data.runId}`).emit('run:progress', data);
    });
    this.eventEmitter.on('execution:completed', (data: any) => {
      this.server.to(`run:${data.runId}`).emit('run:completed', data);
    });
    this.eventEmitter.on('execution:cancelled', (data: any) => {
      this.server.to(`run:${data.runId}`).emit('run:cancelled', data);
    });

    // Bridge interaction events
    this.eventEmitter.on('interaction:required', (data: any) => {
      this.server.to(`session:${data.sessionId}`).emit('interaction:required', data);
      // Also broadcast to all clients for the global interaction queue
      this.server.emit('interaction:required', data);
    });

    // System heartbeat
    setInterval(() => {
      this.server.emit('system:heartbeat', { timestamp: new Date().toISOString() });
    }, 30000);
  }
}
