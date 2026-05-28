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

If you are starting from an empty OCI account, use [deploy/OCI_START_TO_FINISH.md](deploy/OCI_START_TO_FINISH.md).

If the VPS is already created, use [deploy/OCI_DEPLOYMENT.md](deploy/OCI_DEPLOYMENT.md).
