-- V1: core identities + groups
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table (app-local user row mapped from external IdP)
CREATE TABLE users (
                       id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       idp_subject   TEXT NOT NULL UNIQUE,         -- OIDC "sub"
                       email         TEXT UNIQUE,
                       display_name  TEXT NOT NULL,
                       email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       status        TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DISABLED
                       created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE groups (
                        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name        TEXT NOT NULL,
                        created_by  UUID NOT NULL REFERENCES users(id),
                        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE group_members (
                               group_id  UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                               user_id   UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
                               role      TEXT NOT NULL DEFAULT 'MEMBER', -- OWNER, MEMBER
                               joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                               left_at   TIMESTAMPTZ,
                               PRIMARY KEY (group_id, user_id)
);

CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_groups_created_by ON groups(created_by);