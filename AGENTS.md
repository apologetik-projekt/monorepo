# Project Agents.md Guide

This Agents.md file provides comprehensive guidance for AI agents working with this codebase.

## Project Structure

This is a pnpm monorepo.

- `/apps/website`: The Next.js frontend application. This is the main user-facing site.
- `/packages/payload`: The Payload CMS backend. This is used for content management.
- `/pnpm-workspace.yaml`: Defines the workspaces in the monorepo.

## Coding Conventions

### General Conventions
- Use TypeScript for all new code.
- Follow the existing code style in each file.
- Use meaningful variable and function names.
- Add comments for complex logic.

### React Components Guidelines
- Use functional components with hooks.
- Keep components small and focused.
- Ensure proper prop typing.
- Follow the file naming convention: `PascalCase.tsx` for components and `camelCase.ts` for other files.

### CSS/Styling Standards
- Use Tailwind CSS for styling.
- Follow the utility-first approach.
- Use custom CSS only when necessary.

## Programmatic Checks & Commands

Before submitting changes, run the following checks. All checks must pass before code can be merged.

### Website (`/apps/website`)

- **Run development server**: `pnpm --filter=website dev`
- **Build for production**: `pnpm --filter=website build`
- **Lint code**: `pnpm --filter=website lint`
- **Start production server**: `pnpm --filter=website start`

### Payload CMS (`/packages/payload`)

- **Run Payload CLI**: `pnpm --filter=payload payload`
- **Start database**: `pnpm --filter=payload db:start` (uses Docker)
- **Stop database**: `pnpm --filter=payload db:stop` (uses Docker)

## Pull Request Guidelines

When creating a PR, please ensure it:
1.  Includes a clear description of the changes.
2.  References any related issues.
3.  Ensures all tests and checks pass.
4.  Includes screenshots for UI changes.
5.  Keeps PRs focused on a single concern.
