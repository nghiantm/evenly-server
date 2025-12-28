-- V5: integrity checks (lightweight, safe)

-- positive money everywhere
ALTER TABLE expenses
    ADD CONSTRAINT chk_expenses_total_amount_pos CHECK (total_amount > 0);

ALTER TABLE expense_payments
    ADD CONSTRAINT chk_expense_payments_amount_pos CHECK (amount > 0);

ALTER TABLE expense_splits
    ADD CONSTRAINT chk_expense_splits_amount_pos CHECK (amount_owed >= 0);

ALTER TABLE settlements
    ADD CONSTRAINT chk_settlements_amount_pos CHECK (amount > 0);

ALTER TABLE group_transfers
    ADD CONSTRAINT chk_group_transfers_amount_pos CHECK (amount > 0);

-- basic enums (keep simple; can move to real ENUM types later)
ALTER TABLE group_members
    ADD CONSTRAINT chk_group_members_role CHECK (role IN ('OWNER','MEMBER'));

ALTER TABLE users
    ADD CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE','DISABLED'));

-- prevent nonsense
ALTER TABLE group_transfers
    ADD CONSTRAINT chk_group_transfers_not_self CHECK (from_user_id <> to_user_id);
