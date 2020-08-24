# Telegram Bot for Customers

Web-service for handling requests to Trip Trip by Telegram bot

## Development

1. Start PostgreSQL
2. Start Redis
3. copy `.env.dist` to `.env`
4. Fill config to `.env` file
   - `DB_HOST`, `DB_PASSWORD`, `DB_PORT`=5432`,`DB_USER`,`DB_NAME` — config for PostgreSQL
   - `REDIS_HOST`, `REDIS_PORT`, `REDIS_USER`, `REDIS_PASSWORD` — config for Redis
   - `TELEGRAM_TOKEN` — token of Telegram bot
   - `CORE_USER_URL`, `CORE_EAT_URL`, `CORE_COLLABORATION_URL` — URL of Trip Trip backed
   - `VIEW_FORM_URL` — URL of Web Forms for Customers
5. Initialize DB by `yarn evolutions -i`
6. Sync DB-scheme by `yarn evolutions`
7. Start dev-server by `yarn dev`
8. Server runs on [localhost:3000](http://localhost:3000/docs)

## Production

### Release to Trip-Trip infrastructure

1. Push all code for release to `master`
2. Create release by `yarn release`
3. Push code and tag by `git push --follow-tags`
4. CircleCI roll out release
