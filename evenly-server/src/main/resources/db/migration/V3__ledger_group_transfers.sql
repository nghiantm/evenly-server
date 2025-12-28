-- V3: ledger table for fast balances ("from owes to")

CREATE TABLE group_transfers (
                                 id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 group_id      UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                                 expense_id    UUID REFERENCES expenses(id) ON DELETE SET NULL, -- nullable for adjustments
                                 settlement_id UUID, -- added and FK'd in V4
                                 from_user_id  UUID NOT NULL REFERENCES users(id),
                                 to_user_id    UUID NOT NULL REFERENCES users(id),
                                 currency      CHAR(3) NOT NULL DEFAULT 'USD',
                                 amount        NUMERIC(12,2) NOT NULL, -- always positive
                                 created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transfers_group_from_to ON group_transfers(group_id, from_user_id, to_user_id);
CREATE INDEX idx_transfers_group_to ON group_transfers(group_id, to_user_id);
CREATE INDEX idx_transfers_group_from ON group_transfers(group_id, from_user_id);
CREATE INDEX idx_transfers_expense_id ON group_transfers(expense_id);
