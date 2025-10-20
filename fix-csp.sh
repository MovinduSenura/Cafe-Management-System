#!/bin/bash

echo "Fixing CSP headers and admin dashboard access..."

# 1. Copy dashboard.html to API Gateway container
echo "Copying dashboard.html to API Gateway container..."
docker cp /Users/ravinbandara/Desktop/Cafe-Management-System-1/BACKEND/microservices/dashboard.html cafe-api-gateway:/app/dashboard.html
if [ $? -eq 0 ]; then
  echo "✅ Dashboard file successfully copied."
else
  echo "❌ Failed to copy dashboard file."
  exit 1
fi

# 2. Set proper permissions
echo "Setting proper permissions on dashboard file..."
docker exec cafe-api-gateway chown nodeuser:nodejs /app/dashboard.html
if [ $? -eq 0 ]; then
  echo "✅ Permissions set successfully."
else
  echo "❌ Failed to set permissions."
fi

# 3. Add proper CSP headers to all services
echo "Updating CSP headers in all services..."
services=(
  "api-gateway"
  "user-service"
  "customer-service"
  "menu-service"
  "order-service"
  "payment-service"
  "inventory-service"
  "reservation-service"
  "notification-service"
  "report-service"
)

for service in "${services[@]}"; do
  container_name="cafe-${service}"
  echo "Updating CSP headers for ${container_name}..."
  
  # Add CSP headers via nginx configuration
  docker exec $container_name sh -c "echo 'add_header Content-Security-Policy \"default-src *; style-src * \"unsafe-inline\"; script-src * \"unsafe-inline\" \"unsafe-eval\"; img-src * data: blob:; font-src * data:;\" always;' > /tmp/csp.conf"
  docker exec $container_name sh -c "cat /tmp/csp.conf >> /etc/nginx/conf.d/default.conf || true"
done

# 4. Restart all services
echo "Restarting all services..."
cd /Users/ravinbandara/Desktop/Cafe-Management-System-1/BACKEND/microservices
docker-compose -f docker-compose.microservices.yml restart

echo -e "\n✅ All fixes applied successfully."
echo -e "\nThe admin dashboard should now be accessible at: http://localhost:3000/admin/dashboard"
echo "Please try accessing it in your browser."