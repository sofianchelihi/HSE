#!/bin/bash
set -e

cd /var/www

echo ""
echo "========================================="
echo "  ComplaintHub — container startup"
echo "========================================="

# ── 1. Wait for MySQL ─────────────────────────────────────
echo "▶ Waiting for database to be ready..."
until php artisan db:show --no-ansi > /dev/null 2>&1; do
  echo "  ... not ready yet, retrying in 2s"
  sleep 2
done
echo "✓ Database is ready."

# ── 2. Run migrations ─────────────────────────────────────
echo "▶ Running migrations..."
php artisan migrate --force --no-interaction
echo "✓ Migrations done."

# ── 3. Storage symlink (public/storage → storage/app/public)
echo "▶ Linking storage..."
php artisan storage:link --force 2>/dev/null || true

# ── 4. Cache config / routes / views for performance ──────
echo "▶ Caching config, routes and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "✓ Cache warmed."

echo ""
echo "✓ App ready — listening on http://0.0.0.0:8000"
echo "========================================="
echo ""

# ── 5. Start Laravel's built-in server ────────────────────
exec php artisan serve --host=0.0.0.0 --port=8000
