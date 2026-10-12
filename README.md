# Running TCGHub:

## Running the database:

1. `cd app/database`
2. Create a `.env.development`
3. Inside put the port number for postgres in the docker and postgres on the host as well as the database name to use:```POSTGRES_PORT=PORT
		     POSTGRES_HOST_PORT=HOST_PORT
		     POSTGRES_DB=DBNAME```
4. next, create a `secrets/` directory, inside make a `postgres_password.txt` and `postgres_user.txt` files
5. put the password and username for postgres inside
6. run `docker-compose -f docker-compose.database.yml --env-file .env.development up`


## Running the backend:

1. `cd apps/backend`
2. `npm install`
3. Create a `.env` file and fill in your credentials (see `.env.example`):
```
   # port number for server
   SERVER_PORT=PORT_NUMBER
   # secret used to sign JWTs
   SERVER_SECRET=
   # username for postgres
   POSTGRES_USER=
   # password for postgres
   POSTGRES_PASSWORD=
   # port for postgres
   POSTGRES_PORT=
   # ip/url for postgres
   POSTGRES_URL=
   # postgres database to use
   POSTGRES_DATABASE=
   # URL of database in format "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URL}:${POSTGRES_PORT}/${POSTGRES_DATABASE}"
   DATABASE_URL=
```
   **This step must happen before the next one** — `npx prisma generate` requires `DATABASE_URL` to already be set, and will fail with a `PrismaConfigEnvError` if `.env` doesn't exist yet.
4. `npx prisma generate`
5. If `schema.prisma` is in the `prisma/` directory and this is your first time setting up the database, apply the schema:
   `npx prisma migrate dev --name init`
6. Run it:
   - One-off: `npm run build` then `npm run start`
   - Reloading on changes: `watchexec -r -w src npm run build` then `npm run dev`
