# TCGHub — Database Design

**Database:** PostgreSQL (relational)

This document describes the databse model for the TCGHub trading app: which tables exist, how they relate, and the rules that apply when data is deleted. ***At some stage I will update what the technical justification is for each table***

## 1. Table of tables

| Table | Purpose | Supports must-have | Status |
| --- | --- | --- | --- |
| `users` | Accounts and last known location | User profiles, location-based matching | Built |
| `cards` | Master catalogue of every card (sourced from Scryfall) | Card search | Built |
| `user_cards` | Which user owns which card, in what condition, and whether it is up for trade | List of cards for trading | Designed |
| `conversations` | A chat between two users | Messaging / chat | Designed |
| `messages` | Individual messages inside a conversation | Messaging / chat | Designed |
| `blocks` | "User A has blocked User B" | Blocking and reporting | Designed |
| `reports` | "User A reported User B", with a reason and a status | Blocking and reporting | Designed |

## 2. ER diagram

Relationship lines use crow's-foot notation. A line ending in `|o` means the link is optional (the foreign key can be `NULL`, which is required for the `ON DELETE SET NULL` rule described in section 5).

```mermaid
erDiagram
    USERS ||--o{ USER_CARDS : owns
    CARDS ||--o{ USER_CARDS : "listed in"
    USERS |o--o{ CONVERSATIONS : "user1"
    USERS |o--o{ CONVERSATIONS : "user2"
    CONVERSATIONS ||--o{ MESSAGES : contains
    USERS |o--o{ MESSAGES : sends
    USERS |o--o{ BLOCKS : "blocker"
    USERS |o--o{ BLOCKS : "blocked"
    USERS |o--o{ REPORTS : "reporter"
    USERS |o--o{ REPORTS : "reported"

    USERS {
        uuid id PK
        text email
        double_precision last_lat
        double_precision last_long
        timestamp created_at
    }

    CARDS {
        uuid id PK
        text name
        text type_line
        numeric cmc
        text_array color_identity
        text power
        text toughness
        text oracle_text
        text lang
        date released_at
        text rarity
        numeric price_usd
        numeric price_usd_foil
        text image_uri_small
        text image_uri_normal
        text image_uri_large
        text image_uri_grid
        timestamp created_at
    }

    USER_CARDS {
        uuid id PK
        uuid user_id FK
        uuid card_id FK
        integer quantity
        text condition
        boolean for_trade
    }

    CONVERSATIONS {
        uuid id PK
        uuid user1_id FK
        uuid user2_id FK
    }

    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content
        timestamp created_at
    }

    BLOCKS {
        uuid id PK
        uuid blocker_id FK
        uuid blocked_id FK
        timestamp created_at
    }

    REPORTS {
        uuid id PK
        uuid reporter_id FK
        uuid reported_id FK
        text reason
        text reason_detail
        text status
        timestamp created_at
    }
```