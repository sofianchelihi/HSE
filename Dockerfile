# ============================================================
# Stage 1 — Build frontend assets (Inertia/React + Vite)
# ============================================================
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Produces public/build/ with the compiled Inertia bundle
RUN npm run build


# ============================================================
# Stage 2 — PHP 8.5 application runtime
# ============================================================
FROM php:8.5-cli-alpine

# System dependencies
RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    zip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    icu-libs

# PHP extensions
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
        pcntl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Install PHP dependencies first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-scripts \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader

# Copy full application
COPY . .

# Paste the pre-built Inertia bundle (overwrites any stale public/build)
COPY --from=frontend /app/public/build ./public/build

# Bake the Docker-specific environment into the image.
# The local .env is blocked by .dockerignore — only .env.docker reaches here.
COPY .env.docker .env

# Run post-install scripts now that the full app is present
RUN composer run-script post-autoload-dump

# Correct permissions on writable directories
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
