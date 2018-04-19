DROP FUNCTION [dbo].[f_action_rights]
GO

CREATE FUNCTION [dbo].[f_action_rights]
/****************************************************************************************************
 Last modified on

****************************************************************************************************/
(
  @action_id as int = 0
) RETURNS varchar(512)
AS
BEGIN
	declare @rights varchar(512)

	select
		@rights = COALESCE(@rights + ',', '') + LTRIM(STR(u.rights_id))
	from action_rights u
	where u.action_id = @action_id

	RETURN @rights
END

GO


