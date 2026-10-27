#!/bin/bash
# Sets the password for the restricted `afterpost_app` Postgres role that
# Row-Level Security relies on (see prisma/migrations/*_row_level_security).
# Run this once per environment, after migrations have created the role.
# Never commit the password this generates — it only ever lives in that
# environment's own .env / secret manager.
#
# Usage: ./infra/scripts/set-app-role-password.sh [admin-connection-url]
# Defaults to the local dev superuser connection if no URL is given.

set -euo pipefail

ADMIN_URL="${1:-postgresql://afterpost:afterpost@localhost:5433/afterpost}"
PASSWORD="$(node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))")"

psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -c "ALTER ROLE afterpost_app WITH PASSWORD '${PASSWORD}';"

HOST_AND_DB="$(echo "$ADMIN_URL" | sed -E 's#^[^:]+://[^@]+@##')"

echo ""
echo "afterpost_app password set. Put this in your .env as DATABASE_URL:"
echo ""
echo "  postgresql://afterpost_app:${PASSWORD}@${HOST_AND_DB}"
echo ""
echo "Keep DIRECT_DATABASE_URL pointed at the superuser connection (used only by prisma migrate)."
