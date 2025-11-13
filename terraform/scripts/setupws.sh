#!/bin/bash
# ========================
# Setup Node.js App en Ubuntu (sin borrar .env existente)
# ========================

set -e
export HOME=/home/ubuntu

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
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# Marca el directorio como seguro para Git
git config --global --add safe.directory /home/ubuntu/app

# Si no hay repo git, inicializa
if [ ! -d ".git" ]; then
  echo "🟢 Inicializando repositorio Git..."
  git init
  git remote add origin ${repo_url}
fi

# Asegura estar en el branch correcto
echo "📦 Actualizando código desde ${repo_branch}..."
git fetch origin ${repo_branch} || true
git checkout -B ${repo_branch} origin/${repo_branch} || true
git pull origin ${repo_branch} || true

# Instala dependencias
npm install

# Asegura permisos del .env existente
if [ -f "/home/ubuntu/app/.env" ]; then
  chown ubuntu:ubuntu /home/ubuntu/app/.env
  chmod 600 /home/ubuntu/app/.env
else
  echo "⚠️  No se encontró .env, se usará configuración existente o Jenkins la subirá luego."
fi

# Corrige permisos generales
chown -R ubuntu:ubuntu /home/ubuntu/app /home/ubuntu/.pm2 || true

# Ejecuta PM2 como usuario ubuntu
sudo -u ubuntu -i bash <<'EOF'
export HOME=/home/ubuntu
cd /home/ubuntu/app

set -a
source /home/ubuntu/app/.env
set +a


# Reinicia o inicia la app con PM2
pm2 delete node-backend || true
pm2 start "npm run start:ws" --name node-backend

# Guarda configuración y arranque automático
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
EOF
echo "✅ Setup completado."
touch /home/ubuntu/app/setup.done