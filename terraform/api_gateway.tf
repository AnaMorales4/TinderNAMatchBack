# ==========================================================
# API Gateway → EC2 sin ALB (Free Tier Friendly)
# /api/* → EC2 backend HTTP (puerto 8000)
# /ws/*  → EC2 websocket HTTP (puerto 8001)
# ==========================================================

resource "aws_api_gateway_rest_api" "node_api" {
  name        = "ec2-proxy-api"
  description = "API Gateway que reenvía tráfico HTTP a EC2"
}

# ==========================================================
# /api/{proxy+}
# ==========================================================

resource "aws_api_gateway_resource" "api_proxy" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  parent_id   = aws_api_gateway_rest_api.node_api.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_resource" "api_proxy_subpath" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  parent_id   = aws_api_gateway_resource.api_proxy.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "api_any" {
  rest_api_id   = aws_api_gateway_rest_api.node_api.id
  resource_id   = aws_api_gateway_resource.api_proxy_subpath.id
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "api_integration" {
  rest_api_id             = aws_api_gateway_rest_api.node_api.id
  resource_id             = aws_api_gateway_resource.api_proxy_subpath.id
  http_method             = aws_api_gateway_method.api_any.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_eip.backend_ip.public_ip}:8000/{proxy}"

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

# ==========================================================
# /ws/{proxy+}
# ==========================================================

resource "aws_api_gateway_resource" "ws_proxy" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  parent_id   = aws_api_gateway_rest_api.node_api.root_resource_id
  path_part   = "ws"
}

resource "aws_api_gateway_resource" "ws_proxy_subpath" {
  rest_api_id = aws_api_gateway_rest_api.node_api.id
  parent_id   = aws_api_gateway_resource.ws_proxy.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "ws_any" {
  rest_api_id   = aws_api_gateway_rest_api.node_api.id
  resource_id   = aws_api_gateway_resource.ws_proxy_subpath.id
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "ws_integration" {
  rest_api_id             = aws_api_gateway_rest_api.node_api.id
  resource_id             = aws_api_gateway_resource.ws_proxy_subpath.id
  http_method             = aws_api_gateway_method.ws_any.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_eip.ws_ip.public_ip}:8001/{proxy}"

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

# ==========================================================
# Deployment + Stage
# ==========================================================

resource "aws_api_gateway_deployment" "api_deploy" {
  depends_on = [
    aws_api_gateway_integration.api_integration,
    aws_api_gateway_integration.ws_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.node_api.id
}

resource "aws_api_gateway_stage" "api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.node_api.id
  deployment_id = aws_api_gateway_deployment.api_deploy.id
  stage_name    = "prod"
}

# ==========================================================
# Output
# ==========================================================

output "api_gateway_url" {
  description = "URL base para consumir la API"
  value       = "https://${aws_api_gateway_rest_api.node_api.id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_stage.api_stage.stage_name}"
}
