variable "region" {
  description = "Región AWS donde se desplegará la instancia"
  type        = string
  default     = "us-east-2"
}

variable "key_name" {
  description = "Nombre para el par de claves"
  type        = string
  default     = "jenkins-node-key"
}

# Ubuntu Server 22.04 LTS (HVM, SSD) para us-east-2
variable "ami_id" {
  description = "AMI ID de Ubuntu Server"
  type        = string
  default     = "ami-0a0e5d9c7acc336f1"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.micro"
}

variable "repo_url" {
  description = "Repositorio git del proyecto Node.js"
  type        = string
}

variable "repo_branch" {
  description = "Branch del repositorio"
  type        = string
  default     = "main"
}
