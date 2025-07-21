const { spawn } = require('child_process');

// Set required environment variables
process.env.N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE = 'true';
process.env.N8N_HOST = '0.0.0.0';
process.env.N8N_PORT = process.env.PORT || '5678';
process.env.N8N_PROTOCOL = 'https';

console.log('Installing Microsoft 365 MCP Server globally...');

// Install MCP server globally with proper path
const install = spawn('npm', ['install', '-g', '@softeria/ms-365-mcp-server'], { 
  stdio: 'inherit',
  env: { ...process.env, PATH: process.env.PATH + ':/usr/local/bin' }
});

install.on('close', (code) => {
  if (code === 0) {
    console.log('MCP Server installed successfully');
    
    // Ensure global modules are in PATH
    process.env.PATH = process.env.PATH + ':/usr/local/lib/node_modules/.bin:/root/.npm-global/bin';
    
    console.log('Starting n8n...');
    
    // Start n8n
    const n8n = spawn('npx', ['n8n', 'start'], { 
      stdio: 'inherit',
      env: process.env
    });
    
    n8n.on('error', (err) => {
      console.error('Failed to start n8n:', err);
      process.exit(1);
    });
  } else {
    console.error('Failed to install MCP server');
    process.exit(1);
  }
});
