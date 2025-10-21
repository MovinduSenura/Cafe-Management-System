#!/bin/bash

# Create directories for persistent volumes
mkdir -p /tmp/k8s-data/redis /tmp/k8s-data/mongodb

# Give appropriate permissions
chmod -R 777 /tmp/k8s-data

echo "Local persistent volume directories created successfully!"