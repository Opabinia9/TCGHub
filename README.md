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

`cd app/backend`
`npm install`
`npx prisma generate`

create a .env and put in the credential, examples in .env.example:
```
# port number for server
SERVER_PORT=PORT_NUMBER
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

for one off:
`npm run build`
`npm run start`

for reloading on changes:
`watchexec -r -w src npm run build`
`npm run dev`

if schema.prisma is in the the prisma directory, the data can be placed in the database with:
`npx prisma migrate dev --name init`

