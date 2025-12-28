-- V4: settle-up payments + link to ledger rows

CREATE TABLE settlements (
                             id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             group_id         UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                             created_by       UUID NOT NULL REFERENCES users(id),
                             from_user_id     UUID NOT NULL REFERENCES users(id), -- who paid
                             to_user_id       UUID NOT NULL REFERENCES users(id), -- who received
                             currency         CHAR(3) NOT NULL DEFAULT 'USD',
                             amount           NUMERIC(12,2) NOT NULL,
                             settlement_date  DATE NOT NULL,
                             note             TEXT,
                             created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_settlements_group_date ON settlements(group_id, settlement_date);
CREATE INDEX idx_settlements_from_user ON settlements(from_user_id);
CREATE INDEX idx_settlements_to_user ON settlements(to_user_id);

-- add FK now that settlements exists
ALTER TABLE group_transfers
    ADD CONSTRAINT fk_group_transfers_settlement
        FOREIGN KEY (settlement_id) REFERENCES settlements(id) ON DELETE SET NULL;

CREATE INDEX idx_transfers_settlement_id ON group_transfers(settlement_id);
