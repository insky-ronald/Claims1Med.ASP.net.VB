DROP PROCEDURE [dbo].[GetManagePermissions]
GO

CREATE PROCEDURE [dbo].[GetManagePermissions]  (
-- ***************************************************************************************************
-- Last modified on
-- 08-MAR-2017
-- *************************************************************************************************** 
	@role_id as int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		@role_id as role_id,
		id as action_id,
		code,
		action_name,
		action_type_id,
		dbo.f_action_rights(id) as rights,
		dbo.f_action_rights_names(id) as rights_names,
		dbo.f_permissions(@role_id, id) as permissions
	FROM v_actions 
	WHERE status_code_id = 10
	ORDER by position
END

GO


