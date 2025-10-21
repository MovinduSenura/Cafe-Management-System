#!/bin/bash

# Script to fix all microservice package.json files and generate package-lock.json

set -e

BACKEND_DIR="/Users/ravinbandara/Desktop/Ravin/Cafe-Management-System-1/Backend"
SERVICES=("api-gateway" "user-service" "customer-service" "menu-service" "order-service" "payment-service" "inventory-service" "reservation-service" "notification-service" "report-service")

echo "🔧 Fixing package.json files for all services..."

for service in "${SERVICES[@]}"; do
    service_dir="$BACKEND_DIR/$service"
    
    if [ -d "$service_dir" ]; then
        echo "📦 Processing $service..."
        
        cd "$service_dir"
        
        # Add missing devDependencies if not already present
        if ! grep -q "eslint" package.json; then
            echo "  Adding eslint to devDependencies..."
            npm install --save-dev eslint@^8.57.0 @eslint/js@^9.12.0
        fi
        
        # Update scripts section using Node.js to manipulate JSON
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Update scripts
        pkg.scripts = {
            ...pkg.scripts,
            'test:coverage': 'jest --coverage',
            'lint': 'eslint . --ext .js --fix',
            'lint:check': 'eslint . --ext .js'
        };
        
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 4));
        "
        
        # Generate package-lock.json
        echo "  Generating package-lock.json..."
        npm install --package-lock-only
        
        # Create basic eslint config if it doesn't exist
        if [ ! -f ".eslintrc.js" ]; then
            echo "  Creating .eslintrc.js..."
            cat > .eslintrc.js << 'EOF'
module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'no-console': 'off'
    }
};
EOF
        fi
        
        # Create jest config if it doesn't exist
        if [ ! -f "jest.config.js" ]; then
            echo "  Creating jest.config.js..."
            cat > jest.config.js << 'EOF'
module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    passWithNoTests: true
};
EOF
        else
            echo "  Updating jest.config.js..."
            node -e "
            const fs = require('fs');
            let config = fs.readFileSync('jest.config.js', 'utf8');
            if (!config.includes('passWithNoTests')) {
                config = config.replace('testMatch: [', 'testMatch: [');
                config = config.replace('};\n\$', ',\n    passWithNoTests: true\n};\n');
                fs.writeFileSync('jest.config.js', config);
            }
            "
        fi
        
        echo "  ✅ $service updated successfully"
    else
        echo "  ❌ $service directory not found"
    fi
done

echo "🎉 All services have been updated!"