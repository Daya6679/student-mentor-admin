module.exports = {
  apps: [
    {
      name: "students-app-3000",
      script: "index.js",
      env: { PORT: 3000 }
    },
    {
      name: "students-app-3001",
      script: "index.js",
      env: { PORT: 3001 }
    },
    {
      name: "students-app-3002",
      script: "index.js",
      env: { PORT: 3002 }
    }
  ]
};
