-- PostgreSQL Schema for TradeX Landing Page
-- Designed for Neon serverless PostgreSQL database

-- 1. WAITLIST TABLE
CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    experience VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'institutional'
    challenge TEXT NOT NULL,          -- biggest market decision challenge
    tools TEXT NOT NULL,              -- current trading tools
    expectation TEXT NOT NULL,        -- what would make TradeX valuable
    source VARCHAR(100) DEFAULT 'web',
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by VARCHAR(50),          -- referral code of who invited this user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for speedy referral lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_referral ON waitlist(referral_code);

-- 2. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,        -- 'Idea', 'Pain', 'Question', 'Feature'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TERMINAL MESSAGES TABLE (Decision Terminal submissions)
CREATE TABLE IF NOT EXISTS terminal_messages (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
