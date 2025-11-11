terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.region
}

# --- Generar clave privada SSH ---
resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

resource "local_file" "private_key" {
  content         = tls_private_key.rsa_4096.private_key_pem
  filename        = "${path.module}/${var.key_name}.pem"
  file_permission = "0600"
}

# --- Security Group para permitir acceso ---
resource "aws_security_group" "ec2_sg" {
  name        = "${var.key_name}-sg"
  description = "Permite SSH y HTTP"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "jenkins-node-sg"
  }
}

# --- Obtener VPC predeterminada (para asociar el SG) ---
data "aws_vpc" "default" {
  default = true
}

# --- Instancia EC2 con Ubuntu Server ---
resource "aws_instance" "public_instance" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.key_pair.key_name
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true


  user_data = templatefile("${path.module}/scripts/setup.sh", {
    repo_url    = var.repo_url
    repo_branch = var.repo_branch
    secret_jwt  = var.secret_jwt
    mongo_uri   = var.mongo_uri
  })


  tags = {
    Name = "ubuntu-node-server"
  }
}


resource "aws_eip_association" "backend_assoc" {
  instance_id   = aws_instance.public_instance.id
  allocation_id = aws_eip.backend_ip.id
}
