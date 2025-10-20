#!/bin/sh

echo "Creating a dashboard with explicit CSS classes..."

# Create an updated dashboard.html with no inline styles
cat > updated-dashboard.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microservices Dashboard</title>
    <style>
        /* Reset and base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px; color: #333; }
        
        /* Header styles */
        .header { background-color: #1a73e8; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 24px; font-weight: 600; }
        .header p { opacity: 0.8; margin-top: 5px; }
        
        /* Container styles */
        .container { max-width: 1400px; margin: 0 auto; }
        
        /* Services grid */
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        
        /* Service card styles */
        .service-card { background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
        .service-card h2 { font-size: 18px; margin-bottom: 15px; color: #1a73e8; }
        
        /* Status indicators */
        .status { display: flex; align-items: center; margin-bottom: 10px; }
        .status-indicator { width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .status-healthy { background-color: #0f9d58; }
        .status-unhealthy { background-color: #ea4335; }
        .status-unknown { background-color: #fbbc05; }
        .status-text { font-size: 14px; }
        
        /* Info row styles */
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .info-label { font-weight: 600; color: #5f6368; }
        
        /* Button styles */
        .button { display: inline-block; padding: 8px 16px; background-color: #1a73e8; color: white; border: none; 
                  border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 14px; margin-top: 10px; }
        .button:hover { background-color: #1669d9; }
        
        /* Response container */
        .response-container { margin-top: 15px; background-color: #f8f9fa; padding: 10px; border-radius: 4px; 
                              max-height: 100px; overflow-y: auto; font-family: monospace; font-size: 12px; }
        
        /* Footer */
        .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #5f6368; }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .services-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Cafe Management System - Microservices Dashboard</h1>
            <p>Monitor and manage all microservices</p>
        </div>
        
        <div class="services-grid" id="services-grid">
            <!-- Service cards will be generated here via JavaScript -->
        </div>
        
        <div class="footer">
            <p>© 2023 Cafe Management System - Microservices Dashboard</p>
            <button class="button" id="refresh-btn">Refresh All Services</button>
        </div>
    </div>

    <script>
        // Service definitions
        const services = [
            { 
                name: 'API Gateway',
                id: 'api-gateway',
                port: 3000,
                description: 'Central entry point for all services',
                endpoint: '/health'
            },
            { 
                name: 'User Service',
                id: 'user-service',
                port: 3001,
                description: 'Manages user authentication and profiles',
                endpoint: '/api/v1/users/health'
            },
            { 
                name: 'Customer Service',
                id: 'customer-service',
                port: 3002,
                description: 'Handles customer data and feedback',
                endpoint: '/api/v1/customers/health'
            },
            { 
                name: 'Menu Service',
                id: 'menu-service',
                port: 3003,
                description: 'Manages menu items and categories',
                endpoint: '/api/v1/menu/health'
            },
            { 
                name: 'Order Service',
                id: 'order-service',
                port: 3004,
                description: 'Processes and tracks orders',
                endpoint: '/api/v1/orders/health'
            },
            { 
                name: 'Payment Service',
                id: 'payment-service',
                port: 3005,
                description: 'Handles payments and transactions',
                endpoint: '/api/v1/payments/health'
            },
            { 
                name: 'Inventory Service',
                id: 'inventory-service',
                port: 3006,
                description: 'Manages stock and inventory',
                endpoint: '/api/v1/inventory/health'
            },
            { 
                name: 'Reservation Service',
                id: 'reservation-service',
                port: 3007,
                description: 'Handles table reservations',
                endpoint: '/api/v1/reservations/health'
            },
            { 
                name: 'Notification Service',
                id: 'notification-service',
                port: 3008,
                description: 'Sends notifications to users',
                endpoint: '/api/v1/notifications/health'
            },
            { 
                name: 'Report Service',
                id: 'report-service',
                port: 3009,
                description: 'Generates business reports',
                endpoint: '/api/v1/reports/health'
            }
        ];

        // Create service cards
        function createServiceCards() {
            const grid = document.getElementById('services-grid');
            grid.innerHTML = '';
            
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.id = `${service.id}-card`;
                
                card.innerHTML = `
                    <h2>${service.name}</h2>
                    <div class="status">
                        <div class="status-indicator status-unknown" id="${service.id}-status"></div>
                        <div class="status-text" id="${service.id}-status-text">Checking...</div>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Port:</span>
                        <span>${service.port}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Description:</span>
                        <span>${service.description}</span>
                    </div>
                    <button class="button" onclick="checkServiceHealth('${service.id}', ${service.port}, '${service.endpoint}')">
                        Check Health
                    </button>
                    <div class="response-container" id="${service.id}-response" style="display: none;"></div>
                `;
                
                grid.appendChild(card);
            });
            
            // Check all services on load
            checkAllServices();
        }

        // Check service health
        async function checkServiceHealth(serviceId, port, endpoint) {
            const statusIndicator = document.getElementById(`${serviceId}-status`);
            const statusText = document.getElementById(`${serviceId}-status-text`);
            const responseContainer = document.getElementById(`${serviceId}-response`);
            
            statusIndicator.className = 'status-indicator status-unknown';
            statusText.textContent = 'Checking...';
            responseContainer.style.display = 'block';
            responseContainer.textContent = 'Fetching status...';
            
            try {
                const url = `http://localhost:${port}${endpoint}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (response.ok) {
                    statusIndicator.className = 'status-indicator status-healthy';
                    statusText.textContent = 'Healthy';
                    responseContainer.textContent = JSON.stringify(data, null, 2);
                } else {
                    statusIndicator.className = 'status-indicator status-unhealthy';
                    statusText.textContent = 'Unhealthy';
                    responseContainer.textContent = JSON.stringify(data, null, 2);
                }
            } catch (error) {
                statusIndicator.className = 'status-indicator status-unhealthy';
                statusText.textContent = 'Unhealthy';
                responseContainer.textContent = `Error: ${error.message}`;
            }
        }

        // Check all services
        function checkAllServices() {
            services.forEach(service => {
                checkServiceHealth(service.id, service.port, service.endpoint);
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createServiceCards();
            
            // Set up auto-refresh every 30 seconds
            setInterval(checkAllServices, 30000);
            
            // Set up manual refresh button
            document.getElementById('refresh-btn').addEventListener('click', checkAllServices);
        });
    </script>
</body>
</html>
EOF

# Copy the updated dashboard to the API Gateway container
echo "Copying updated dashboard to API Gateway container..."
docker cp updated-dashboard.html cafe-api-gateway:/app/dashboard.html

# Restart the API Gateway
echo "Restarting API Gateway..."
docker restart cafe-api-gateway

echo -e "\n✅ Dashboard has been updated with clean CSS (no inline styles)."
echo -e "\nThe admin dashboard should now be accessible at: http://localhost:3000/admin/dashboard"
echo "Please try accessing it in your browser."