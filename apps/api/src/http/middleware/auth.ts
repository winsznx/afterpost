import type { FastifyReply, FastifyRequest } from "fastify";
import { resolveSession } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { withWorkspaceScope } from "../../lib/workspace-scope.js";
import { AUTH_REQUIRED, ROLE_FORBIDDEN } from "../errors.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: { id: string; email: string };
  }
}

/**
 * Attaches `request.user` from a verified Bearer session token. Throws
 * AUTH_REQUIRED (401) if missing/invalid — use as a route `preHandler`.
 */
export async function requireAuth(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw AUTH_REQUIRED("Missing Authorization: Bearer <token> header");

  const user = await resolveSession(prisma, token);
  if (!user) throw AUTH_REQUIRED("Session token is invalid, expired, or revoked");

  request.user = user;
}

const ROLE_RANK = { VIEWER: 0, ANALYST: 1, ADMIN: 2, OWNER: 3, PROMOTER_PORTAL: 0 } as const;
type Role = keyof typeof ROLE_RANK;

/**
 * Verifies the authenticated user belongs to `workspaceId` with at least
 * `minRole`. Must run after requireAuth. This is the server-side
 * enforcement PRD §2.2 requires ("not merely hidden in the UI") — every
 * org-scoped query checks membership here, not just a client-side guard.
 */
export async function requireWorkspaceRole(
  request: FastifyRequest,
  workspaceId: string,
  minRole: Role,
): Promise<void> {
  if (!request.user) throw AUTH_REQUIRED();
  const userId = request.user.id;

  // workspace_members carries Row-Level Security (RLS requires the
  // session variable set first — see workspace-scope.ts). This read
  // happens inside a workspace_id-scoped transaction for exactly that
  // reason, not merely as a style choice.
  const membership = await withWorkspaceScope(workspaceId, (tx) =>
    tx.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    }),
  );
  if (!membership || membership.status !== "ACTIVE") {
    throw ROLE_FORBIDDEN("Not a member of this workspace");
  }
  if (ROLE_RANK[membership.role as Role] < ROLE_RANK[minRole]) {
    throw ROLE_FORBIDDEN(`Requires ${minRole} role or higher`);
  }
}
