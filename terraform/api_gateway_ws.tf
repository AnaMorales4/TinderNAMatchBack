# Crear WebSocket API
resource "aws_apigatewayv2_api" "ws_api" {
  name                       = "websocket-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

# Crear ruta de conexión
resource "aws_apigatewayv2_route" "connect_route" {
  api_id    = aws_apigatewayv2_api.ws_api.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_integration.id}"
}

# Crear ruta de desconexión
resource "aws_apigatewayv2_route" "disconnect_route" {
  api_id    = aws_apigatewayv2_api.ws_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_integration.id}"
}

# Crear ruta de mensaje (ejemplo: chat)
resource "aws_apigatewayv2_route" "message_route" {
  api_id    = aws_apigatewayv2_api.ws_api.id
  route_key = "chat"
  target    = "integrations/${aws_apigatewayv2_integration.ws_integration.id}"
}

# Integración con la EC2 WebSocket
resource "aws_apigatewayv2_integration" "ws_integration" {
  api_id             = aws_apigatewayv2_api.ws_api.id
  integration_type   = "HTTP_PROXY"
  integration_method = "ANY"
  integration_uri    = "http://${aws_eip.ws_ip.public_ip}:8001/"
}

# Deployment
resource "aws_apigatewayv2_deployment" "ws_deployment" {
  api_id = aws_apigatewayv2_api.ws_api.id

  depends_on = [
    aws_apigatewayv2_route.connect_route,
    aws_apigatewayv2_route.disconnect_route,
    aws_apigatewayv2_route.message_route
  ]
}

# Stage
resource "aws_apigatewayv2_stage" "ws_stage" {
  api_id        = aws_apigatewayv2_api.ws_api.id
  name          = "prod"
  deployment_id = aws_apigatewayv2_deployment.ws_deployment.id
  auto_deploy   = true
}

