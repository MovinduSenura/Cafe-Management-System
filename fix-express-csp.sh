#!/bin/bash

echo "Updating CSP headers in Express configurations..."

# Execute the update inside the API Gateway container
docker exec cafe-api-gateway bash -c "sed -i 's/styleSrc: \[\"'"'"'self'"'"'\"\]/styleSrc: \[\"'"'"'self'"'"'\", \"'"'"'unsafe-inline'"'"'\"\]/g' server.js"
docker exec cafe-api-gateway bash -c "sed -i 's/scriptSrc: \[\"'"'"'self'"'"'\"\]/scriptSrc: \[\"'"'"'self'"'"'\", \"'"'"'unsafe-inline'"'"'\", \"'"'"'unsafe-eval'"'"'\"\]/g' server.js"

# Verify the dashboard.html file is in place
echo "Verifying dashboard.html placement..."
if docker exec cafe-api-gateway ls -la /app/dashboard.html; then
    echo "✅ Dashboard file is present."
else
    echo "❌ Dashboard file is not present. Copying it now..."
    docker cp /Users/ravinbandara/Desktop/Cafe-Management-System-1/BACKEND/microservices/dashboard.html cafe-api-gateway:/app/dashboard.html
fi

# Update dashboard.html route in server.js if needed
docker exec cafe-api-gateway bash -c "grep -q 'admin/dashboard' server.js || echo \"app.use('/admin/dashboard', (req, res) => { res.sendFile(path.join(__dirname, 'dashboard.html')); });\" >> server.js"

# Restart the API Gateway
echo "Restarting API Gateway..."
docker restart cafe-api-gateway

echo -e "\n✅ CSP headers updated in Express configuration."
echo -e "\nThe admin dashboard should now be accessible at: http://localhost:3000/admin/dashboard"
echo "Please try accessing it in your browser."