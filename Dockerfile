###############################################################################
# Stage 1 – Build the React/Vite frontend
###############################################################################
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

# Install deps first (better layer caching)
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

# vite.config.ts sets outDir: "../backend/frontend_build"
# In this container WORKDIR is /frontend, so that resolves to /backend/frontend_build
RUN npm run build


###############################################################################
# Stage 2 – Django + Gunicorn  (serves API + SPA via WhiteNoise)
###############################################################################
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# System libraries required by WeasyPrint (PDF generation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi8 \
    shared-mime-info \
    fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Django source
COPY backend/ .

# Vite build output → Django can find index.html + assets
COPY --from=frontend-build /backend/frontend_build ./frontend_build

# Pre-compress & fingerprint static files so WhiteNoise can serve them
# (no DB connection needed for collectstatic)
RUN DJANGO_SECRET_KEY=dummy-collectstatic-only \
    DATABASE_URL=sqlite:////tmp/build.db \
    python manage.py collectstatic --no-input

EXPOSE 8000

# NOTE: on Fly.io, run migrations via the release command in fly.toml:
#   [deploy]
#   release_command = "python manage.py migrate"
#
# That way a failed migration rolls back the deployment instead of
# crashing every new instance.
CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000", "--workers", "2"]
