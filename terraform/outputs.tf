output "ec2_public_ip" {
  description = "IP pública de la instancia EC2"
  value       = aws_instance.public_instance.public_ip
}

output "ec2_public_dns" {
  description = "DNS público de la instancia EC2"
  value       = aws_instance.public_instance.public_dns
}

output "private_key_path" {
  description = "Ruta del archivo PEM generado"
  value       = local_file.private_key.filename
}
