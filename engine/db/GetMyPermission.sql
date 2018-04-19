DROP PROCEDURE [dbo].[GetMyPermission]
GO

CREATE PROCEDURE [dbo].[GetMyPermission]  (
-- ***************************************************************************************************
-- Last modified on
-- 09-MAR-2017
-- *************************************************************************************************** 
	@action_code as varchar(20),
    @visit_id as bigint = 0
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @this_user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @action_id as int = 0

	SELECT
		@action_id = id
	FROM actions WHERE code = @action_code

	DECLARE @permission as table (
		id int,
		value bit
	)
	
	INSERT INTO @permission(id, value) SELECT rights_id, 0 FROM action_rights WHERE action_id = @action_id

	IF EXISTS(SELECT * FROM user_roles WHERE user_id = @this_user_id AND role_id = 5) -- Super user role
		UPDATE @permission SET value = 1
	ELSE
		UPDATE @permission SET
			t.value = CASE WHEN ISNULL(p.rights_id, 0) > 0 THEN 1 ELSE 0 END
		FROM @permission t
		JOIN permissions p on p.action_id = @action_id and t.id = p.rights_id
		WHERE p.role_id in (SELECT role_id FROM user_roles WHERE user_id = @this_user_id) and action_id = @action_id

	SELECT 
		p.id,
		r.code,
		p.value
	FROM @permission p
	JOIN rights r on p.id = r.id
	ORDER BY r.position

END

GO


