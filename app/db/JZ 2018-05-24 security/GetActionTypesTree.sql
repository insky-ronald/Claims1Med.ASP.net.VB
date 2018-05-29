USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[GetActionTypesTree]
GO

CREATE PROCEDURE [dbo].[GetActionTypesTree]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @main as table (
		id int identity(1,1),
		parent_id int,
		code char(3),
		parent_code char(3),
		description varchar(100),
		sort varchar(10)
	)

	INSERT INTO @main(parent_id, code, parent_code, description, sort) 
		SELECT 
			0,
			code,
			'',
			action_type,
			code+'.000'
		FROM action_types

	INSERT INTO @main(parent_id, code, parent_code, description, sort) 
		SELECT 
			m.id,
			n.code,
			n.action_type,
			n.action_name,
			n.action_type +'.' + n.code
		FROM actions n
		JOIN @main m on n.action_type = m.code
	
	SELECT
		 id,
		 parent_id,
		 code,
		 parent_code,
		 description
	from @main ORDER BY sort
END
GO
