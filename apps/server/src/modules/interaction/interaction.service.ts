import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InteractionService {
  private readonly logger = new Logger(InteractionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createInteraction(
    sessionId: string,
    data: {
      type: string;
      priority?: string;
      title: string;
      message: string;
      options?: Array<{ label: string; value: string; description?: string }>;
      timeoutSeconds?: number;
    },
  ) {
    const timeoutAt = data.timeoutSeconds
      ? new Date(Date.now() + data.timeoutSeconds * 1000)
      : undefined;

    const interaction = await this.prisma.userInteraction.create({
      data: {
        sessionId,
        type: data.type,
        priority: data.priority || 'normal',
        title: data.title,
        message: data.message,
        options: data.options || [],
        timeoutAt,
      },
    });

    this.eventEmitter.emit('interaction:required', {
      interactionId: interaction.id,
      sessionId,
      type: interaction.type,
      title: interaction.title,
      message: interaction.message,
      options: data.options,
      timeout: data.timeoutSeconds || 300,
    });

    return interaction;
  }

  async respond(interactionId: string, userId: string, response: string) {
    const interaction = await this.prisma.userInteraction.update({
      where: { id: interactionId },
      data: { response, respondedBy: userId, respondedAt: new Date(), status: 'responded' },
    });

    this.eventEmitter.emit('interaction:responded', { interactionId, response });

    return interaction;
  }

  async skip(interactionId: string) {
    await this.prisma.userInteraction.update({
      where: { id: interactionId },
      data: { status: 'cancelled' },
    });

    this.eventEmitter.emit('interaction:cancelled', { interactionId });
  }

  async listPending(sessionId: string) {
    return this.prisma.userInteraction.findMany({
      where: { sessionId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
