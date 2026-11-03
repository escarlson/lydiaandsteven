module.exports = {
  apps: [{
    name: 'lydiaandsteven',
    script: 'npm',
    args: 'start',
    cwd: '/opt/lydiaandsteven',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};