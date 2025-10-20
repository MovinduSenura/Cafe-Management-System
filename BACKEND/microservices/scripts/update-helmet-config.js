/**
 * Script to update Helmet configuration in all microservices
 * to allow inline styles and scripts
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Base directory for microservices
const microservicesDir = path.join(__dirname, '..');

// List of microservices
const microservices = [
  'api-gateway',
  'user-service',
  'customer-service',
  'menu-service',
  'order-service',
  'payment-service',
  'inventory-service',
  'reservation-service',
  'notification-service',
  'report-service'
];

// Function to update the Helmet configuration
async function updateHelmetConfig(servicePath) {
  try {
    const serverJsPath = path.join(servicePath, 'server.js');
    
    if (!fs.existsSync(serverJsPath)) {
      console.log(`No server.js found for ${path.basename(servicePath)}`);
      return { service: path.basename(servicePath), updated: false };
    }
    
    let content = await readFile(serverJsPath, 'utf8');
    
    // Check if file includes helmet
    if (!content.includes('helmet')) {
      console.log(`${path.basename(servicePath)}: No helmet configuration found`);
      return { service: path.basename(servicePath), updated: false };
    }
    
    // Check for simple helmet initialization without config
    if (content.includes('app.use(helmet());')) {
      // Replace with configured version
      content = content.replace(
        'app.use(helmet());',
        `app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }
}));`
      );
      
      await writeFile(serverJsPath, content, 'utf8');
      console.log(`✅ Updated Helmet configuration for ${path.basename(servicePath)}`);
      return { service: path.basename(servicePath), updated: true };
    }
    
    // Already has a custom helmet config, but need to ensure CSP is properly configured
    if (content.includes('helmet({') && !content.includes('contentSecurityPolicy')) {
      // Find the helmet configuration and add CSP to it
      const helmetRegex = /app\.use\(helmet\(\{([^}]*)\}\)\);/s;
      const match = content.match(helmetRegex);
      
      if (match) {
        const updatedConfig = `app.use(helmet({${match[1]},
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }
}));`;
        
        content = content.replace(helmetRegex, updatedConfig);
        await writeFile(serverJsPath, content, 'utf8');
        console.log(`✅ Added CSP to existing Helmet configuration for ${path.basename(servicePath)}`);
        return { service: path.basename(servicePath), updated: true };
      }
    }
    
    console.log(`⚠️ ${path.basename(servicePath)}: Could not update Helmet configuration automatically`);
    return { service: path.basename(servicePath), updated: false };
  } catch (error) {
    console.error(`Error updating ${servicePath}:`, error);
    return { service: path.basename(servicePath), updated: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log('Updating Helmet configuration in all microservices...\n');
  
  const results = [];
  
  for (const service of microservices) {
    const servicePath = path.join(microservicesDir, service);
    if (fs.existsSync(servicePath)) {
      const result = await updateHelmetConfig(servicePath);
      results.push(result);
    } else {
      console.log(`⚠️ Service directory not found: ${service}`);
      results.push({ service, updated: false, error: 'Directory not found' });
    }
  }
  
  // Print summary
  console.log('\n=== Update Summary ===');
  const updatedCount = results.filter(r => r.updated).length;
  console.log(`Updated ${updatedCount}/${results.length} microservices`);
  
  if (updatedCount > 0) {
    console.log('\nYou will need to rebuild the affected services:');
    console.log(`cd ${microservicesDir} && docker-compose -f docker-compose.microservices.yml up -d --build`);
  }
}

main().catch(console.error);