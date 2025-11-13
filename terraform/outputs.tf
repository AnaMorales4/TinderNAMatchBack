output "backend_ip" {
  value = aws_eip.backend_ip.public_ip
}

output "websocket_ip" {
  value = aws_eip.ws_ip.public_ip
}

output "backend_public_ip" {
  value = aws_eip.backend_ip.public_ip
}

output "ws_public_ip" {
  value = aws_eip.ws_ip.public_ip
}

# Output
output "ws_api_url" {
  description = "URL WebSocket para conectar desde el frontend"
  value       = aws_apigatewayv2_stage.ws_stage.invoke_url
}
