let server;

function toExit() {
  if (server) {
    server.kill(0);
    server = null;
  }
}

export function serve() {
  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('yarn', ['run', 'start'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}
