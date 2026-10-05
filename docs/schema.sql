-- TCGHub schema
-- Run against a fresh PostgreSQL database, top to bottom.
-- 
-- Required once per database, so gen_random_uuid() is available.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    last_lat    DOUBLE PRECISION,
    last_long   DOUBLE PRECISION,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- cards  (populated from the Scryfall API)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cards (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    type_line         TEXT,
    cmc               NUMERIC,
    color_identity    TEXT[],
    power             TEXT,        -- text, not integer: some cards use "*" or "1+*"
    toughness         TEXT,        -- same reason as power
    oracle_text       TEXT,
    lang              TEXT,
    released_at       DATE,
    rarity            TEXT,
    price_usd         NUMERIC,
    price_usd_foil    NUMERIC,
    image_uri_small   TEXT,
    image_uri_normal  TEXT,
    image_uri_large   TEXT,
    image_uri_grid    TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- user_cards  (join table: which user owns which card)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_cards (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id     UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    quantity    INTEGER NOT NULL DEFAULT 1,
    condition   TEXT,
    for_trade   BOOLEAN DEFAULT false
);

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    user2_id   UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id   UUID REFERENCES conversations(id),
    sender_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    content           TEXT NOT NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- blocks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blocks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    blocked_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- reports
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    reported_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    reason         TEXT NOT NULL,       -- fixed categories + 'other' -- exact list TBD by the team
    reason_detail  TEXT,                -- only used when reason = 'other'
    status         TEXT NOT NULL DEFAULT 'pending',  -- 'pending' or 'resolved'
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);
