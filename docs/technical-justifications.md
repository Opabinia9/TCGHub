# TCGHub — Technical Justifications (Database)

Stage 3 deliverable: Technical Justifications (the "why" behind each design choice in database-schema.md)

This captures the reasoning behind the database decisions, so the team can defend them in review without reconstructing the thinking from scratch.

## Why PostgreSQL

The app's core data (user accounts, ownership, messages, moderation) is naturally relational: every table's rows relate to other tables' rows in well-defined ways (a user owns many cards, a card is owned by many users, a conversation has exactly two participants). PostgreSQL was chosen over a document-oriented database because those relationships, and the constraints that keep them correct (foreign keys, uniqueness, cascade rules), are enforced by the database itself rather than by application code.

## Why UUID primary keys instead of auto-incrementing integers

Auto-incrementing integer IDs (SERIAL/BIGSERIAL) are simpler, but they leak information: if a user's profile is at /users/42, an attacker can enumerate every user by counting up from 1, and can estimate how many users or cards exist. UUIDs avoid this. The trade-off is a small amount of extra typing effort and slightly larger storage per row, which the team judged worth it given the app exposes user-facing IDs (in URLs, API responses) and privacy/security was an explicit priority.

## Why a join table for user_cards instead of a column on users

A user can own many cards, and a card can be owned by many users — a many-to-many relationship. Postgres has no way to store "an arbitrary list of cards" directly as columns on users, so the relationship needs its own table. This also gives a natural home for data that only makes sense in the context of this specific ownership — quantity and condition are properties of "this user owning this card," not of the user or the card alone.

## Why power and toughness are TEXT, not INTEGER

Scryfall's data includes values like "*" and "1+*" for creatures whose power/toughness depends on game state. Storing these as INTEGER would either crash the import on those cards or force silently dropping them. Storing as TEXT guarantees every card can be imported; the cost is that numeric comparisons (WHERE power > 3) aren't possible directly in SQL and would need to happen in application code after parsing.

## Why color_identity is a Postgres array (TEXT[]) rather than its own table

Color identity is a small, fixed set of values (W/U/B/R/G) that is very unlikely to change. A join table (the same pattern used for user_cards) would be the more "normalized" choice, but for a fixed, small set it adds a table and a join for little practical benefit. Postgres arrays support direct queries (WHERE 'U' = ANY(color_identity)), which covers the querying the team expects to need for an MVP.

## Why prices and image_uris are flat columns, not jsonb

Scryfall returns prices and image_uris as nested JSON objects. Two options were considered:

- A jsonb column holding the whole nested object. Simpler on import (no unpacking needed) and resilient to Scryfall adding new fields later, but querying a specific value needs Postgres's ->>'field' syntax, and there's no type-checking on what's inside.
- Flat columns, one per specific value needed (price_usd, price_usd_foil, image_uri_small, image_uri_normal, image_uri_large, image_uri_grid).

The team chose flat columns because the specific fields needed for display (a small number of price points and image sizes) are already known, and flat columns support ordinary SQL (WHERE price_usd > 5, ORDER BY price_usd) without special syntax. The trade-off, accepted deliberately: if Scryfall adds a new field the team later wants, it requires a migration (ALTER TABLE ... ADD COLUMN) rather than being available automatically.

## Why cascade behaviour differs by table

The guiding rule: a row that is owned by one user and meaningless without them is deleted with that user (ON DELETE CASCADE). A row that also matters to a second person is kept, with the reference to the deleted user cleared instead (ON DELETE SET NULL).

- user_cards cascades, because a collection entry has no meaning once its owner is gone.
- conversations, messages, blocks, and reports use SET NULL, because each of these involves two people, and deleting one person's account should not silently destroy the other person's data (their message history, or a filed report). This also prevents a reported user from being able to erase a report against them simply by deleting their account.

SET NULL requires the referencing column to allow NULL, so every user-reference column on those four tables is nullable by design, not by oversight.

## Why blocks and reports are separate tables rather than one

Both tables link two users, but they serve different purposes. A block is a private, silent action with no consequence beyond hiding one user from another — it needs no reason or review. A report is a moderation event intended to be reviewed by a person or a future admin tool — it needs a reason, optional detail text, and a status. Combining them into one table with a type column was considered, but keeping them separate makes each table's purpose unambiguous and avoids nullable columns that only make sense for one of the two "types."

## Why reports.status has only two values (pending / resolved)

A more fine-grained status (under_review, actioned, dismissed, etc.) was considered, but the team scoped moderation tooling as explicitly outside the MVP's core focus (trading, search, chat, matching). Two values are enough to represent "needs a look" vs "dealt with," and matches what the team realistically expects to build and use within the project timeline.
