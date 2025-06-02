# ---------- Build Frontend ----------
    FROM node:20 AS frontend

    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend/ .
    RUN npm run build
    
    # ---------- Build Backend ----------
    FROM python:3.11-slim AS backend
    
    WORKDIR /app
    COPY backend/requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    COPY backend/ ./backend
    COPY --from=frontend /app/frontend/dist ./frontend_dist
    
    # ---------- Final Image ----------
    FROM python:3.11-slim
    
    WORKDIR /app
    COPY --from=backend /app /app
    
    ENV PYTHONUNBUFFERED=1
    
    EXPOSE 8000
    CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
    