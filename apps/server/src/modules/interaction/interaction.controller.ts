import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InteractionService } from './interaction.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Interactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get()
  async listPending(@Param('projectId') _projectId: string) {
    // In production, filter by project's active sessions
    return []; // Placeholder
  }

  @Get(':interactionId')
  async get(@Param('interactionId') interactionId: string) {
    return interactionId;
  }

  @Post(':interactionId/respond')
  async respond(
    @Param('interactionId') interactionId: string,
    @Req() req: any,
    @Body() dto: { response: string },
  ) {
    return this.interactionService.respond(interactionId, req.user.sub, dto.response);
  }

  @Post(':interactionId/skip')
  async skip(@Param('interactionId') interactionId: string) {
    return this.interactionService.skip(interactionId);
  }
}
