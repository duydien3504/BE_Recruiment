module.exports = {
  apps: [
    {
      name: 'backend-api',
      script: 'src/server.js',
      instances: 'max', // Chạy trên tất cả các core CPU
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
