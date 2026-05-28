# Cloud-OCI-Deployement-SMART

Monorepo for deploying the Classroom PERN application to an OCI Ubuntu VPS.

## Structure

```text
classroom-frontend/  React + Vite static frontend
classroom-backend/   Express + TypeScript backend
deploy/              OCI, Nginx, and PM2 deployment files
```

The PostgreSQL database is hosted on Neon and is not installed on the OCI server.

## Deployment

Start with [deploy/OCI_DEPLOYMENT.md](deploy/OCI_DEPLOYMENT.md).
