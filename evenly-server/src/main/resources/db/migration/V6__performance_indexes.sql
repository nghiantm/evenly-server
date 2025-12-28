-- V6: extra indexes commonly useful for queries

-- Many queries filter active membership; partial index helps
CREATE INDEX idx_group_members_active
    ON group_members(group_id, user_id)
    WHERE left_at IS NULL;

-- Common list endpoints
CREATE INDEX idx_expenses_group_created_at ON expenses(group_id, created_at);

-- Useful if you query expense details frequently
CREATE INDEX idx_expense_splits_expense_user ON expense_splits(expense_id, user_id);
CREATE INDEX idx_expense_payments_expense_payer ON expense_payments(expense_id, payer_id);

-- For balance queries (pairwise) this is already good:
-- idx_transfers_group_from_to (from V3)