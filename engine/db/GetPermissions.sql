DROP PROCEDURE [dbo].[GetPermissions]
GO

CREATE PROCEDURE [dbo].[GetPermissions]  (
-- ***************************************************************************************************
-- Last modified on
-- 08-MAR-2017
-- *************************************************************************************************** 
	@role_id as int = 0,
	@action_id as int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
    
	select
		id as action_id,
		@role_id as role_id,
		dbo.f_action_rights(id) as rights,
		dbo.f_action_rights_names(id) as rights_names,
		dbo.f_permissions(@role_id, id) as permissions
	from actions
	where id = @action_id

END

GO


