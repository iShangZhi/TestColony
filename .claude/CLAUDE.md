# TestColony Project Instructions

## Project Overview
TestColony is an AI-native testing platform based on multi-agent collaboration.
It uses Claude Code as the underlying AI driver for agent execution.

## Core Agents
- **test-case-generator**: Main Agent A - generates test cases from PRD documents
- **test-executor**: Main Agent B - executes automated tests based on generated test cases
- **prd-analyzer**: Sub-agent for analyzing PRD documents

## Built-in Skills
- **prd-analyzer**: Analyzes PRD documents to extract functional requirements
- **test-case-writer**: Writes structured test cases in standard format
- **boundary-value-analyzer**: Analyzes boundary values and edge cases
- **test-executor**: Executes automated tests with framework integration
- **failure-analyzer**: Analyzes test failures and suggests fixes

## Architecture
- Backend: NestJS (Fastify) at apps/server/
- Frontend: Next.js 14+ at apps/web/
- Shared types: packages/shared-types/
- Database: PostgreSQL with Prisma ORM

## Development
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm test` - Run all tests
