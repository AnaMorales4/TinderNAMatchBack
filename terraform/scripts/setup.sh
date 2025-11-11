#!/bin/bash
# ========================
# Setup Node.js App en Ubuntu
# ========================

set -e

# Actualiza e instala dependencias
apt update -y
apt upgrade -y
apt install -y curl git

# Instala Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs npm

# Instala PM2 globalmente
npm install -g pm2

# Configura entorno de trabajo
cd /home/ubuntu

# Clona el repositorio
git clone -b ${repo_branch} ${repo_url} app
cd app

# Instala dependencias del proyecto
npm install

# Crear archivo .env con las variables de entorno
echo  SECRET_JWT=${secret_jwt} > /home/ubuntu/app/.env
echo  MONGO_URI=${mongo_uri}  >> /home/ubuntu/app/.env

# Asegura permisos
chown ubuntu:ubuntu /home/ubuntu/app/.env
chmod 600 /home/ubuntu/app/.env

# Cambia propietario de los archivos a ubuntu (por si se ejecuta como root)
chown -R ubuntu:ubuntu /home/ubuntu/app /home/ubuntu/.pm2 || true

# Ejecuta PM2 como usuario ubuntu
sudo -u ubuntu -i bash <<'EOF'
cd /home/ubuntu/app

# Inicia la app en modo dev con PM2
pm2 start "npm run dev" --name node-backend

# Guarda la configuración de PM2
pm2 save

# Configura arranque automático
pm2 startup systemd -u ubuntu --hp /home/ubuntu
EOF
