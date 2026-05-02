# Fullstack Mastery — Module 4: Authentication & Authorization (JWT + RBAC)

Four standalone NestJS demos aligned with course contents:

| Folder | Topic |
| --- | --- |
| `0-jwt-authentication-flow` | Sign up / sign in, bcrypt, JWT access token, `JwtAuthGuard`, protected profile route |
| `1-refresh-token-strategy` | Short-lived access token + refresh rotation / revocation (`hashedRefreshToken`) |
| `2-rbac-and-guards` | AuthN vs AuthZ: `JwtAuthGuard` + `RolesGuard` + `@Roles()` |
| `3-oauth2-google-login` | Google OAuth2 (`passport-google-oauth20`), silent registration, internal JWT |

Each subfolder has its own `package.json`. Typical flow:

```bash
cd <folder>
docker compose -f .docker/postgresql.yaml up -d
cp .env.example .env   # adjust secrets / Google vars for oauth demo
npm install
npm run start:dev
```

Use port **3000** and PostgreSQL on **5432** with credentials from `.docker/postgresql.yaml` unless you override env.

## Lint (ESLint)

These demos **do not** ship their own `eslint.config.mjs`. From the **starci-academy-backend** repo root (same tree as `eslint.config.mjs`), run:

```bash
npm run lint:fullstack-module4-auth-demos
```
