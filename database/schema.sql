-- =====================================
-- ECHO ISLES RPG DATABASE
-- =====================================

-- Player accounts
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player characters
CREATE TABLE IF NOT EXISTS characters (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(20) UNIQUE NOT NULL,
    race VARCHAR(30) NOT NULL DEFAULT 'Human',
    gender VARCHAR(20),
    class VARCHAR(30) DEFAULT 'Swordsman',
    level INTEGER NOT NULL DEFAULT 1,
    experience BIGINT NOT NULL DEFAULT 0,
    gold BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player inventory
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    item_id VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- Player professions
CREATE TABLE IF NOT EXISTS professions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    profession_name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    experience BIGINT NOT NULL DEFAULT 0,
    UNIQUE(character_id, profession_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_characters_account
ON characters(account_id);

CREATE INDEX IF NOT EXISTS idx_inventory_character
ON inventory(character_id);

CREATE INDEX IF NOT EXISTS idx_professions_character
ON professions(character_id);
