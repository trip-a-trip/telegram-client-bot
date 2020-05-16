module.exports = {
  apps: [
    {
      name: 'view-telegram',
      script: './dist/main.js',
      watch: false,
      instances: 'max',
      exec_mode: 'cluster',
      merge_logs: true,
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
