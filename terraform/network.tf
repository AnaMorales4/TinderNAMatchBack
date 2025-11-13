resource "aws_eip" "backend_ip" {
  domain = "vpc"

  # lifecycle {
  #   prevent_destroy = true
  # }

  tags = {
    Name = "permanent-backend-ip"
  }
}
