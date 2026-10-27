import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma.js";

/**
 * Runs `fn` inside a transaction with `app.workspace_id` set for the
 * Postgres session running it — the value every Row-Level Security policy
 * checks (prisma/migrations/*_row_level_security). Using `set_config(...,
 * true)` rather than a bare `SET LOCAL app.workspace_id = ...` string: SET
 * does not accept a bound parameter in Postgres, so a bare SET would mean
 * either unsafe string interpolation or no parameterization at all.
 * `set_config` is a normal function call and takes a real bind parameter.
 * The `true` third argument scopes it to the transaction (LOCAL
 * semantics), so it cannot leak onto a pooled connection reused by an
 * unrelated request afterward.
 */
export async function withWorkspaceScope<T>(
  workspaceId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.workspace_id', ${workspaceId}, true)`;
    return fn(tx);
  });
}

export type { PrismaClient };
