#!/bin/bash

# Fix common linting issues across all services

services="customer-service menu-service order-service payment-service inventory-service reservation-service notification-service report-service"

for service in $services; do
    echo "Fixing linting issues in $service..."
    
    # Fix unused config import in app.js
    if [ -f "$service/src/app.js" ]; then
        sed -i '' '/const config = require.*config.*);/d' "$service/src/app.js"
        echo "  - Fixed unused config import in $service/src/app.js"
    fi
    
    # Fix unused next parameter in errorHandler.js
    if [ -f "$service/src/middleware/errorHandler.js" ]; then
        sed -i '' 's/const errorHandler = (err, req, res, next)/const errorHandler = (err, req, res, _next)/' "$service/src/middleware/errorHandler.js"
        echo "  - Fixed unused next parameter in $service/src/middleware/errorHandler.js"
    fi
done

echo "All common linting issues fixed!"