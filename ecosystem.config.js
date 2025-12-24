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
    }
  }]
};