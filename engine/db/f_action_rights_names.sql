DROP FUNCTION [dbo].[f_action_rights_names]
GO

CREATE FUNCTION [dbo].[f_action_rights_names]
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
		@rights = COALESCE(@rights + ', ', '') + r.rights
	from action_rights u
		join rights r on u.rights_id = r.id
	where u.action_id = @action_id
	order by r.position

	RETURN @rights
END

GO


