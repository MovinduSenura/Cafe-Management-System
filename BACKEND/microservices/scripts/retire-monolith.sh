#!/bin/bash

# Script to gracefully stop the monolithic backend server running on port 8000
# This script is part of the migration from monolithic architecture to microservices

echo "Retiring monolithic backend on port 8000..."

# Find the process running on port 8000
PID=$(lsof -i :8000 -t)

if [ -z "$PID" ]; then
  echo "No process found running on port 8000."
  exit 0
fi

echo "Found process $PID running on port 8000. Stopping gracefully..."

# Try to send SIGTERM first for graceful shutdown
kill -15 $PID

# Wait for up to 10 seconds for the process to exit
for i in {1..10}; do
  if ! ps -p $PID > /dev/null; then
    echo "Process $PID successfully terminated."
    echo "Monolithic backend has been retired. All requests should now be handled by the microservices API Gateway on port 3000."
    exit 0
  fi
  sleep 1
  echo "Waiting for process to exit... ($i/10)"
done

# If still running, force kill
if ps -p $PID > /dev/null; then
  echo "Process did not terminate gracefully. Sending SIGKILL..."
  kill -9 $PID
  if ! ps -p $PID > /dev/null; then
    echo "Process $PID forcefully terminated."
    echo "Monolithic backend has been retired. All requests should now be handled by the microservices API Gateway on port 3000."
  else
    echo "Failed to terminate process $PID. Please check manually."
  fi
fi

echo ""
echo "===================================================================================="
echo "  MIGRATION COMPLETE: Monolithic Backend Retired                                   "
echo "===================================================================================="
echo ""
echo "All application traffic has been redirected to the microservices architecture."
echo ""
echo "API Gateway: http://localhost:3000"
echo "Microservices:"
echo "  - User Service:         http://localhost:3001"
echo "  - Customer Service:     http://localhost:3002"
echo "  - Menu Service:         http://localhost:3003"
echo "  - Order Service:        http://localhost:3004"
echo "  - Payment Service:      http://localhost:3005"
echo "  - Inventory Service:    http://localhost:3006"
echo "  - Reservation Service:  http://localhost:3007"
echo "  - Notification Service: http://localhost:3008"
echo "  - Report Service:       http://localhost:3009"
echo ""
echo "To check the status of all microservices, visit:"
echo "file:///Users/ravinbandara/Desktop/Cafe-Management-System-1/BACKEND/microservices/dashboard.html"
echo ""
echo "===================================================================================="