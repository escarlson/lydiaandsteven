module.exports = {
  apps: [{
    name: 'lydiaandsteven',
    script: 'npm',
    args: 'start',
    cwd: '/root/lydiaandsteven',  // Your project path
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/root/lydiaandsteven/logs/pm2-error.log',
    out_file: '/root/lydiaandsteven/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
  }]
};