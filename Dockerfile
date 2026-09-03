# SmartPark Production Container Image
FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing .pyc files & enable unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt requirements-lock.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Expose HTTP port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/parking/public || exit 1

# Run entry point
CMD ["python", "app.py", "--port", "8000"]
