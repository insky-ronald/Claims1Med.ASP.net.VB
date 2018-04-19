DROP PROCEDURE [dbo].[GetActionRights]
GO

CREATE PROCEDURE [dbo].[GetActionRights]  (
-- ***************************************************************************************************
-- Last modified on
-- 09-MAR-2017
-- *************************************************************************************************** 
	@action_id as int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
    
	select
		p.rights_id as id,
		r.rights
	from action_rights p
	join rights r on p.rights_id = r.id
	where p.action_id = @action_id

END

GO


