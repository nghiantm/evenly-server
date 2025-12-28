-- V2: expenses + payments + splits

CREATE TABLE expenses (
                          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          group_id     UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                          created_by   UUID NOT NULL REFERENCES users(id),
                          description  TEXT,
                          currency     CHAR(3) NOT NULL DEFAULT 'USD',
                          total_amount NUMERIC(12,2) NOT NULL,
                          expense_date DATE NOT NULL,
                          created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
                          updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
                          deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_expenses_group_date ON expenses(group_id, expense_date);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);

-- Supports multi-payer expenses
CREATE TABLE expense_payments (
                                  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
                                  payer_id   UUID NOT NULL REFERENCES users(id),
                                  amount     NUMERIC(12,2) NOT NULL
);

CREATE INDEX idx_expense_payments_expense_id ON expense_payments(expense_id);
CREATE INDEX idx_expense_payments_payer_id ON expense_payments(payer_id);

-- Store resolved per-user owed amount (simple and fast)
CREATE TABLE expense_splits (
                                id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                expense_id  UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
                                user_id     UUID NOT NULL REFERENCES users(id),
                                amount_owed NUMERIC(12,2) NOT NULL,
                                split_type  TEXT -- EQUAL, PERCENT, EXACT, SHARE (optional)
);

CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON expense_splits(user_id);
