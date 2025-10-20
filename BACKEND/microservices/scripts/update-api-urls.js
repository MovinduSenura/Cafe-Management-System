/**
 * Script to update all frontend API URLs from port 8000 to port 3000
 * This script helps migrate from the monolithic backend to microservices
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directories to scan for files
const directories = [
  path.join(__dirname, '../../../frontend/src'),
  path.join(__dirname, '../../../client/src')
];

// List of file extensions to scan
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

// Function to walk through directories recursively
async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let results = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(await walkDir(filePath));
    } else if (fileExtensions.includes(path.extname(file))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to update URLs in a file
async function updateFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Replace all occurrences of localhost:8000 with localhost:3000
    if (content.includes('localhost:8000')) {
      console.log(`Updating ${filePath}`);
      const updatedContent = content.replace(/http:\/\/localhost:8000/g, 'http://localhost:3000');
      await writeFile(filePath, updatedContent, 'utf8');
      return { filePath, changed: true };
    }
    
    return { filePath, changed: false };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { filePath, changed: false, error };
  }
}

// Main function to process all directories
async function main() {
  try {
    let files = [];
    
    // Get all JS files from directories
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        files = files.concat(await walkDir(dir));
      } else {
        console.warn(`Directory not found: ${dir}`);
      }
    }
    
    console.log(`Found ${files.length} files to scan`);
    
    // Update each file
    let changedFiles = 0;
    let errorFiles = 0;
    
    for (const file of files) {
      const result = await updateFile(file);
      if (result.changed) changedFiles++;
      if (result.error) errorFiles++;
    }
    
    console.log(`
Migration Summary:
-----------------
Total files scanned: ${files.length}
Files updated: ${changedFiles}
Files with errors: ${errorFiles}
    `);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);