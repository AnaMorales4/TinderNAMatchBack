# --- EC2 Backend ---
resource "aws_instance" "backend" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.key_pair.key_name
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/scripts/setupback.sh", {
    repo_url    = var.repo_url
    repo_branch = var.repo_branch
    secret_jwt  = var.secret_jwt
    mongo_uri   = var.mongo_uri
  })

  tags = {
    Name = "backend-server"
  }
}

resource "aws_eip" "backend_ip" {
  domain = "vpc"
  tags = {
    Name = "backend-ip"
  }
}

resource "aws_eip_association" "backend_assoc" {
  instance_id   = aws_instance.backend.id
  allocation_id = aws_eip.backend_ip.id
}

# --- EC2 WebSocket ---
resource "aws_instance" "websocket" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.key_pair.key_name
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/scripts/setupws.sh", {
    repo_url    = var.repo_url
    repo_branch = var.repo_branch
    secret_jwt  = var.secret_jwt
    mongo_uri   = var.mongo_uri
  })

  tags = {
    Name = "websocket-server"
  }
}

resource "aws_eip" "ws_ip" {
  domain = "vpc"
  tags = {
    Name = "ws-ip"
  }
}

resource "aws_eip_association" "ws_assoc" {
  instance_id   = aws_instance.websocket.id
  allocation_id = aws_eip.ws_ip.id
}
