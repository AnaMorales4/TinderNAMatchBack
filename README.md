# CS2_TinderClone_NAMatch

Subject Name: Software Construction 2

Project Name: TinderClone

Team: NAMatch

Team Members:
• Nikol Henao
• Ana María Morales
• Mariana Ospina

Description:NAMatch is a tinder application clone project made with Node.

Requirements:
• Node.js
• Express.js

Compilation and execution instructions: 1.

• Clone the repository
• You must have nodejs installed
• npm install to install all the dependencies listed in the package.json file.

add to the .env of the backend:

SECRET_JWT=esteesmijwtkey

MONGO_URI=mongodb://localhost:27017/mydatabase

Añadir credenciales de aws desde variables de entorno como:
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="us-east-2"

Tambien se lanza el comando:

terraform apply -auto-approve   -var="repo_url=https://github.com/AnaMorales4/TinderNAMatchBack.git"   -var="repo_branch=main"
