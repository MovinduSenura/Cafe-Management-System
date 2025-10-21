# Infrastructure Configuration

This directory contains all infrastructure-related configurations and deployment scripts for the Cafe Management System.

## Directory Structure

```
infrastructure/
├── k8s/                    # Kubernetes manifests
│   ├── base/              # Base configurations (namespace, configmaps)
│   ├── services/          # Service deployments
│   ├── infrastructure/    # External dependencies (MongoDB, Redis)
│   └── environments/      # Environment-specific configs
├── docker-compose/        # Docker Compose configurations
├── monitoring/           # Monitoring and observability configs
└── scripts/              # Deployment and maintenance scripts
```

## Deployment Options

### Docker Compose (Development)
```bash
cd docker-compose
docker-compose -f docker-compose.microservices.yml up -d
```

### Kubernetes (Production)
```bash
cd k8s
./deploy.sh
```

## Best Practices

1. **Separation of Concerns**: Infrastructure is separate from application code
2. **Environment Management**: Different configs for dev/staging/prod
3. **Version Control**: Infrastructure changes are tracked separately
4. **Access Control**: DevOps teams can manage infrastructure independently
5. **Scalability**: Easy to scale infrastructure without affecting app code

## Monitoring

- Health checks for all services
- Prometheus metrics collection
- Grafana dashboards
- Log aggregation with ELK stack

## Security

- Network policies
- RBAC configurations
- Secret management
- TLS certificates
