FROM node:20

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# Starte im Dev-Modus (Port 5173, Hot Reload)
CMD ["npm", "run", "dev"]
