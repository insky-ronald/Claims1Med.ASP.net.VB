DROP VIEW [dbo].[v_valid_policies]
GO

CREATE VIEW [dbo].[v_valid_policies]
-- ***************************************************************************************************
-- Last modified on
-- 05-MAY-2018
-- *************************************************************************************************** 
as
	select cast(2000001 as int) as id
	union
	select cast(2000003 as int) as id
	union
	select cast(2000004 as int) as id
	union
	select cast(2000005 as int) as id
	union
	select cast(2000318 as int) as id
	union
	select cast(2000481 as int) as id
	union
	select cast(2000988 as int) as id

GO


