#!/bin/bash
# Script to create Kubernetes configurations and deploy all microservices

# Path to the base directory
BASE_DIR="/Users/ravinbandara/Desktop/Cafe-Management-System-1"
SERVICES_DIR="${BASE_DIR}/infrastructure/k8s/services"
BACKEND_DIR="${BASE_DIR}/BACKEND"

# Define services and ports as arrays
services=("menu-service" "order-service" "payment-service" "inventory-service" "reservation-service" "notification-service" "report-service")
ports=(3003 3004 3005 3006 3007 3008 3009)

# Loop through each service
for i in "${!services[@]}"; do
  service="${services[$i]}"
  port="${ports[$i]}"
  echo "Processing ${service} on port ${port}..."
  
  # 1. Update Dockerfile to create logs directory
  dockerfile="${BACKEND_DIR}/${service}/Dockerfile"
  if [ -f "$dockerfile" ]; then
    # Check if logs directory is already being created in the Dockerfile
    if ! grep -q "mkdir -p /app/logs" "$dockerfile"; then
      echo "Updating Dockerfile for ${service} to create logs directory..."
      sed -i '' 's|COPY . .\nRUN addgroup|COPY . .\nRUN mkdir -p /app/logs \&\& chmod -R 777 /app/logs \&\& \\\n    addgroup|' "$dockerfile"
    else
      echo "Logs directory already configured in Dockerfile for ${service}"
    fi
  else
    echo "Dockerfile not found for ${service}. Skipping."
    continue
  fi
  
  # 2. Create Kubernetes service configuration
  k8s_config="${SERVICES_DIR}/${service}.yaml"
  echo "Creating Kubernetes configuration for ${service} at ${k8s_config}..."
  
  cat > "$k8s_config" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service}
  namespace: cafe-management
  labels:
    app: ${service}
    tier: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${service}
  template:
    metadata:
      labels:
        app: ${service}
        tier: backend
    spec:
      serviceAccountName: cafe-management-sa
      containers:
      - name: ${service}
        image: cafe-management/${service}:latest
        imagePullPolicy: Never
        ports:
        - containerPort: ${port}
        env:
        - name: PORT
          value: "${port}"
        - name: MONGODB_URI
          value: "mongodb://\$(MONGODB_USERNAME):\$(MONGODB_PASSWORD)@mongodb-service:27017/${service}?authSource=admin"
        envFrom:
        - configMapRef:
            name: cafe-config
        - secretRef:
            name: cafe-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "300m"
        livenessProbe:
          httpGet:
            path: /health
            port: ${port}
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: ${port}
          initialDelaySeconds: 5
          periodSeconds: 5
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
        volumeMounts:
        - name: logs-volume
          mountPath: /app/logs
      volumes:
      - name: logs-volume
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: ${service}
  namespace: cafe-management
  labels:
    app: ${service}
spec:
  ports:
  - port: ${port}
    targetPort: ${port}
    name: http
  selector:
    app: ${service}
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${service}-hpa
  namespace: cafe-management
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${service}
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF

  # 3. Build Docker image for the service
  echo "Building Docker image for ${service}..."
  (cd "${BACKEND_DIR}/${service}" && docker build -t "cafe-management/${service}:latest" .)
  
  # 4. Apply the Kubernetes configuration
  echo "Deploying ${service} to Kubernetes..."
  kubectl apply -f "$k8s_config"
  
  echo "${service} processed and deployed successfully."
  echo "---------------------------------------------"
done

echo "All services have been processed and deployed."
echo "Checking pod status..."
kubectl get pods -n cafe-management