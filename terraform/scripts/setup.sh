#!/bin/bash
# ========================
# Setup Node.js App en Ubuntu (sin borrar .env existente)
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
cd /home/ubuntu/app

# Si no hay .git, inicializa el repo
if [ ! -d ".git" ]; then
  git init
  git remote add origin ${repo_url}
fi

# Asegura estar en el branch correcto
git fetch origin ${repo_branch}
git checkout -B ${repo_branch} origin/${repo_branch}
git pull origin ${repo_branch}

# Instala dependencias
npm install

# Asegura permisos del .env existente
chown ubuntu:ubuntu /home/ubuntu/app/.env
chmod 600 /home/ubuntu/app/.env

# Cambia propietario general
chown -R ubuntu:ubuntu /home/ubuntu/app /home/ubuntu/.pm2 || true

# Ejecuta PM2 como usuario ubuntu
sudo -u ubuntu -i bash <<'EOF'
cd /home/ubuntu/app

# Inicia o reinicia la app con PM2
pm2 delete node-backend || true
pm2 start "npm run dev" --name node-backend

# Guarda la configuración de PM2
pm2 save

# Configura arranque automático
pm2 startup systemd -u ubuntu --hp /home/ubuntu
EOF
