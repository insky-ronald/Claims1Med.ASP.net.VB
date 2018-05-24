USE [MEDICS52SYS]
GO

ALTER TABLE actions ADD parent_id int DEFAULT 0
GO

UPDATE actions SET parent_id = 0, position = 1
UPDATE actions SET parent_id = 1 WHERE application_id = 0
UPDATE actions SET parent_id = 2 WHERE application_id = 5002
GO

DELETE actions WHERE application_id not in (0, 5002)
GO

/*
ALTER TABLE actions DROP column parent_id

*/
