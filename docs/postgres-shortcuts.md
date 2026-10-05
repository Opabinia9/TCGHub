# Postgres Quick Reference — Tables & Columns

A running reference for the Postgres commands used while building out this schema — table creation, column types, constraints, and how to check your work.

## Creating a table

```sql
CREATE TABLE table_name (
    column_name TYPE constraints,
    column_name TYPE constraints
);
```

- Table and column names: lowercase, snake_case by convention.
- Every statement ends with a semicolon.
- If the table might already exist and you don't want an error: CREATE TABLE IF NOT EXISTS table_name (...);

Example:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## Common column types

| Type | Use for |
| --- | --- |
| UUID | Unique identifiers (with DEFAULT gen_random_uuid()) |
| TEXT | Strings of any length (names, descriptions, URLs) |
| INTEGER | Whole numbers |
| DOUBLE PRECISION | Decimal numbers (coordinates, non-money measurements) |
| NUMERIC(p, s) | Exact decimals, e.g. money — p = total digits, s = digits after the decimal |
| BOOLEAN | True/false flags |
| DATE | A calendar date, no time |
| TIMESTAMP | Date and time |
| JSONB | Nested/structured data (API responses, flexible attributes) |
| TEXT[] | An array of text values |

Postgres also needs CREATE EXTENSION IF NOT EXISTS pgcrypto; run once per database before gen_random_uuid() will work.

## Common constraints

| Constraint | Meaning |
| --- | --- |
| PRIMARY KEY | Uniquely identifies each row; auto-indexed |
| NOT NULL | Column is required |
| UNIQUE | No two rows can share this value |
| DEFAULT value | Auto-fills when nothing is supplied on insert |
| REFERENCES other_table(id) | Foreign key — links this column to another table's primary key |
| ON DELETE CASCADE | Deleting the referenced row deletes this row too |
| ON DELETE SET NULL | Deleting the referenced row sets this column to NULL instead (column must allow NULL) |

Foreign key example:

```sql
CREATE TABLE user_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1
);
```

## Altering a table

```sql
-- Add a column
ALTER TABLE table_name ADD COLUMN column_name TYPE;

-- Drop a column
ALTER TABLE table_name DROP COLUMN column_name;

-- Rename a column
ALTER TABLE table_name RENAME COLUMN old_name TO new_name;

-- Change a column's type
ALTER TABLE table_name ALTER COLUMN column_name TYPE new_type;

-- Add or drop NOT NULL
ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;
ALTER TABLE table_name ALTER COLUMN column_name DROP NOT NULL;
```

## Inspecting tables

In psql:

| Command | Shows |
| --- | --- |
| \l | List all databases |
| \c database_name | Switch to a different database |
| \dt | List all tables in the current database |
| \d table_name | Columns, types, and constraints for one table |
| \d+ table_name | Same, plus storage/size details |

With plain SQL (works anywhere, including the VS Code extension):

```sql
SELECT * FROM table_name LIMIT 10;
```

## Dropping tables and columns

```sql
-- Drop a table entirely (careful — irreversible)
DROP TABLE table_name;

-- Only drop if it exists, no error if it doesn't
DROP TABLE IF EXISTS table_name;

-- Drop a column
ALTER TABLE table_name DROP COLUMN column_name;
```

If other tables have a foreign key pointing at the one you're dropping, Postgres will refuse unless you add CASCADE: DROP TABLE table_name CASCADE; — this also drops the dependent foreign key constraints, so double-check what depends on it first with \d table_name before using it.
