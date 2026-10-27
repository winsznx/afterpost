import { CreateWorkspaceRequestSchema, type WorkspaceDto } from "@afterpost/contracts";
import type { FastifyInstance } from "fastify";
import { requireAuth, requireWorkspaceRole } from "../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import { withWorkspaceScope } from "../../lib/workspace-scope.js";
import { ApiError, NOT_FOUND, VALIDATION_FAILED } from "../errors.js";

function toDto(workspace: {
  id: string;
  slug: string;
  displayName: string;
  timezone: string;
  createdAt: Date;
}): WorkspaceDto {
  return {
    id: workspace.id,
    slug: workspace.slug,
    displayName: workspace.displayName,
    timezone: workspace.timezone,
    createdAt: workspace.createdAt.toISOString(),
  };
}

/** FR-A02 (P0): workspace creation. Owner is the authenticated user — never
 * an arbitrary ID supplied in the request body. */
export async function workspaceRoutes(app: FastifyInstance): Promise<void> {
  app.post("/v1/workspaces", { preHandler: requireAuth }, async (request, reply) => {
    const bodyResult = CreateWorkspaceRequestSchema.safeParse(request.body);
    if (!bodyResult.success) {
      throw VALIDATION_FAILED({ issues: bodyResult.error.issues });
    }

    const ownerId = request.user!.id;

    const existing = await prisma.workspace.findUnique({ where: { slug: bodyResult.data.slug } });
    if (existing) {
      throw new ApiError(
        "SLUG_TAKEN",
        `Workspace slug '${bodyResult.data.slug}' is already in use`,
        409,
      );
    }

    // `workspaces` itself carries no RLS (it's the tenant boundary, not a
    // tenant-owned record); `workspace_members` does, so app.workspace_id
    // must be set (via set_config, LOCAL scope) before that insert — both
    // in the same transaction so workspace+membership stay atomic.
    const workspace = await prisma.$transaction(async (tx) => {
      const ws = await tx.workspace.create({
        data: {
          slug: bodyResult.data.slug,
          displayName: bodyResult.data.name,
          ownerId,
        },
      });
      await tx.$executeRaw`SELECT set_config('app.workspace_id', ${ws.id}, true)`;
      await tx.workspaceMember.create({
        data: { workspaceId: ws.id, userId: ownerId, role: "OWNER" },
      });
      return ws;
    });

    reply.code(201);
    return toDto(workspace);
  });

  app.get("/v1/workspaces/:id", { preHandler: requireAuth }, async (request) => {
    const { id } = request.params as { id: string };
    await requireWorkspaceRole(request, id, "VIEWER");
    const workspace = await prisma.workspace.findUnique({ where: { id } });
    if (!workspace) throw NOT_FOUND("Workspace");
    return toDto(workspace);
  });
}
