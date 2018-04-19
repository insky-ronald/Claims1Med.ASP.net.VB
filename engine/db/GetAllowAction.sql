DROP PROCEDURE [dbo].[GetAllowAction]
GO

CREATE PROCEDURE [dbo].[GetAllowAction]  (
-- ***************************************************************************************************
-- Last modified on
-- 09-MAR-2017
-- *************************************************************************************************** 
	@action_code as varchar(20),
	@allow as bit = 0 OUTPUT,
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

	SET @allow = 0

	IF EXISTS(SELECT * FROM user_roles WHERE user_id = @this_user_id AND role_id = 5) -- Super user role
	BEGIN
		SET @allow = 1
	END ELSE
	BEGIN
		SELECT
			@allow = CASE WHEN p.rights_id > 0 THEN 1 ELSE 0 END
		FROM permissions p
		WHERE p.action_id = @action_id and p.rights_id = 10 -- 10 is View rights
			AND p.role_id in (SELECT role_id FROM user_roles WHERE user_id = @this_user_id)
	END

END

GO


