module.exports = {
  apps: [
    {
      name: "classroom-backend",
      script: "dist/index.js",
      cwd: "/var/www/classroom/app/classroom-backend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "8000",
      },
    },
  ],
};
