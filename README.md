# Kubernetes Ingress Controller Setup Guide

A comprehensive guide for setting up and configuring NGINX Ingress Controller in Kubernetes, supporting both domain-based and path-based routing configurations.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Installing Helm](#installing-helm)
  - [Setting up Ingress Controller](#setting-up-ingress-controller)
- [Configuration Guide](#configuration-guide)
  - [Domain-based Routing](#domain-based-routing)
  - [Path-based Routing](#path-based-routing)
  - [Rewrite Rules](#rewrite-rules)
- [Local Development](#local-development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following:
* Kubernetes cluster (v1.20 or higher)
* `kubectl` command-line tool
* Administrative access to your cluster
* Linux/Unix environment for running commands

## Project Structure
```
.
├── README.md
├── ingress/
│   └── controller/
│       └── nginx/
│           ├── manifests/
│           │   └── nginx-ingress.1.5.1.yaml
│           └── config/
│               ├── domain-based-ingress.yaml
│               └── path-based-ingress.yaml
└── scripts/
    └── install-helm.sh
```

## Getting Started

### Installing Helm

Helm is required for managing the NGINX Ingress Controller installation. Follow these steps to install Helm:

```bash
# Download Helm
curl -o /tmp/helm.tar.gz -LO https://get.helm.sh/helm-v3.10.1-linux-amd64.tar.gz

# Extract the archive
tar -C /tmp/ -zxvf /tmp/helm.tar.gz

# Move helm binary to path
mv /tmp/linux-amd64/helm /usr/local/bin/helm

# Make it executable
chmod +x /usr/local/bin/helm
```

### Setting up Ingress Controller

1. **Add the NGINX Ingress repository:**
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm search repo ingress-nginx --versions
```

2. **Set Version Variables:**
```bash
CHART_VERSION="4.4.0"
APP_VERSION="1.5.1"
```

> **Version Selection Guide:**
> - The CHART_VERSION refers to the Helm chart version
> - The APP_VERSION refers to the NGINX Ingress Controller version
> - Always check the [compatibility matrix](https://github.com/kubernetes/ingress-nginx#supported-versions-table)
> - For production environments, use stable versions

3. **Generate the Installation Manifest:**
```bash
# Create directory structure
mkdir -p ./ingress/controller/nginx/manifests/

# Generate manifest using helm template
helm template ingress-nginx ingress-nginx \
--repo https://kubernetes.github.io/ingress-nginx \
--version ${CHART_VERSION} \
--namespace ingress-nginx \
> ./ingress/controller/nginx/manifests/nginx-ingress.${APP_VERSION}.yaml
```

4. **Modify Service Configuration:**
   * Open the generated manifest file
   * Locate the Service configuration
   * Change the service type to NodePort
   * Configure ports:
     * HTTP: 30080
     * HTTPS: 30443

5. **Deploy the Controller:**
```bash
# Create namespace
kubectl create namespace ingress-nginx

# Apply the configuration
kubectl apply -f ./ingress/controller/nginx/manifests/nginx-ingress.${APP_VERSION}.yaml
```

## Configuration Guide

### Domain-based Routing

Use this configuration for routing based on domain names:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog-service
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: blog.matrix.me
    http:
      paths:
      - path: /blog
        pathType: Prefix
        backend:
          service:
            name: blog-service
            port:
              number: 80
```

### Path-based Routing

For routing based on URL paths:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog-service
spec:
  ingressClassName: nginx
  rules:
  - host: matrix.me
    http:
      paths:
      - path: /blog
        pathType: Prefix
        backend:
          service:
            name: blog-service
            port:
              number: 80
```

### Rewrite Rules

For advanced path rewriting:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog-service
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
  - host: matrix.me
    http:
      paths:
      - path: /path-a(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: blog-service
            port:
              number: 80
```

## Local Development

For local development and testing:

1. **Port Forwarding Setup:**
```bash
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
```

2. **Testing Configuration:**
```bash
# Test the endpoint
curl -H "Host: blog.matrix.me" http://localhost:8080/blog

# For HTTPS
curl -k -H "Host: blog.matrix.me" https://localhost:8443/blog
```

## Troubleshooting

Common issues and their solutions:

### 1. Controller Pod Issues
```bash
# Check pod status
kubectl get pods -n ingress-nginx

# View controller logs
kubectl logs -n ingress-nginx deploy/ingress-nginx-controller

# Describe pod for events
kubectl describe pod -n ingress-nginx <pod-name>
```

### 2. Routing Problems
```bash
# Verify ingress resource
kubectl describe ingress <ingress-name>

# Check endpoints
kubectl get endpoints

# Validate service
kubectl describe service <service-name>
```

### 3. Common Error Solutions
* **404 Not Found**: Verify path configuration and service endpoint
* **503 Service Unavailable**: Check if backend service is running
* **502 Bad Gateway**: Validate service port configuration