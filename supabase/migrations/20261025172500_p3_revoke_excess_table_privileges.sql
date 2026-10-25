-- P3.1: Harden exposed roles without changing public read or admin CRUD.
-- Row-level security does not apply to TRUNCATE. Runtime clients also do not
-- need TRIGGER or REFERENCES table privileges.
-- Keep SELECT/INSERT/UPDATE/DELETE privileges: RLS still governs those actions.
REVOKE TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
