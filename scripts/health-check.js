#!/usr/bin/env node
// Quick System Health Check
require('dotenv').config({ path: './.env.local' });

console.log('🏥 Ultra Premium AA Manager - Health Check');
console.log('==========================================');

const checks = [
  {
    name: 'Environment Variables',
    test: () => {
      const required = [
        'AA_API_USERNAME',
        'AA_API_PASSWORD', 
        'GEMINI_API_KEY',
        'NEXT_PUBLIC_FIREBASE_API_KEY'
      ];
      
      const missing = required.filter(key => !process.env[key]);
      return {
        pass: missing.length === 0,
        message: missing.length === 0 ? 'All required variables set' : `Missing: ${missing.join(', ')}`
      };
    }
  },
  {
    name: 'Next.js Server',
    test: async () => {
      try {
        const response = await fetch('http://localhost:3000/api/health');
        return {
          pass: response.ok,
          message: response.ok ? 'Server responding' : 'Server not responding'
        };
      } catch (error) {
        return {
          pass: false,
          message: 'Server not accessible - make sure "npm run dev" is running'
        };
      }
    }
  },
  {
    name: 'Ultra AA Manager Page',
    test: async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/dashboard/ultra-aa-manager');
        return {
          pass: response.ok,
          message: response.ok ? 'Ultra AA Manager page accessible' : 'Page not accessible'
        };
      } catch (error) {
        return {
          pass: false,
          message: 'Ultra AA Manager page not accessible'
        };
      }
    }
  }
];

async function runHealthCheck() {
  let passedChecks = 0;
  
  for (const check of checks) {
    process.stdout.write(`\n🔍 ${check.name}... `);
    
    try {
      const result = await check.test();
      if (result.pass) {
        console.log(`✅ ${result.message}`);
        passedChecks++;
      } else {
        console.log(`❌ ${result.message}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n==========================================');
  console.log(`🏁 Health Check Results: ${passedChecks}/${checks.length} passed`);
  
  if (passedChecks === checks.length) {
    console.log('🎉 System is healthy and ready for use!');
    console.log('👉 Visit: http://localhost:3000/admin/dashboard/ultra-aa-manager');
  } else {
    console.log('⚠️  Some checks failed. Please review the issues above.');
  }
}

// Add a simple health endpoint check without external dependencies
const https = require('http');

// Run the health check
runHealthCheck().catch(console.error);
