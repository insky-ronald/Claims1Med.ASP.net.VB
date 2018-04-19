DROP FUNCTION [dbo].[f_permissions]
GO

CREATE FUNCTION [dbo].[f_permissions]
/****************************************************************************************************
 Last modified on

****************************************************************************************************/
(
  @role_id as int = 0,
  @action_id as int = 0
) RETURNS varchar(512)
AS
BEGIN
	declare @rights varchar(512)

	select
		@rights = COALESCE(@rights + ',', '') + LTRIM(STR(u.rights_id))
	from permissions u
	where u.role_id = @role_id and u.action_id = @action_id

	RETURN ISNULL(@rights, '')
END

GO


