#!/bin/bash
set -e

apt update -y
apt upgrade -y
apt install -y curl git

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs npm
npm install -g pm2

cd /home/ubuntu

# Si la carpeta ya existe, actualiza el repo
if [ -d "app/.git" ]; then
  cd app
  echo "📦 Actualizando repositorio existente..."
  git fetch --all
  git reset --hard origin/${repo_branch}
else
  echo "🆕 Clonando repositorio..."
  git clone -b ${repo_branch} ${repo_url} app
  cd app
fi

# Instala dependencias
npm install

# No reescribe .env si ya existe
if [ ! -f /home/ubuntu/app/.env ]; then
  echo "🔧 Creando nuevo archivo .env..."
  echo SECRET_JWT=${secret_jwt} > /home/ubuntu/app/.env
  echo MONGO_URI=${mongo_uri} >> /home/ubuntu/app/.env
fi

# Permisos
chown ubuntu:ubuntu /home/ubuntu/app/.env
chmod 600 /home/ubuntu/app/.env
chown -R ubuntu:ubuntu /home/ubuntu/app /home/ubuntu/.pm2 || true

# Ejecuta PM2
sudo -u ubuntu -i bash <<'EOF'
cd /home/ubuntu/app
pm2 restart node-backend || pm2 start "npm run dev" --name node-backend
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
EOF
