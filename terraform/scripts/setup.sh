#!/bin/bash
# ========================
# Setup Node.js App en Ubuntu
# ========================

# Actualiza e instala dependencias
apt update -y
apt upgrade -y
apt install -y curl git

# Instala Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instala PM2 para ejecutar Node.js en background
npm install -g pm2

# Clona el repositorio
cd /home/ubuntu
git clone -b ${repo_branch} ${repo_url} app
cd app/backend

# Instala dependencias
npm install
npm run build || echo "No build script found, continuando..."

# Inicia la aplicación con pm2
pm2 start dist/app.js --name node-backend
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
