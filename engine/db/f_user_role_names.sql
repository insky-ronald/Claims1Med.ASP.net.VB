DROP FUNCTION [dbo].[f_user_role_names]
GO

CREATE FUNCTION [dbo].[f_user_role_names]
/****************************************************************************************************
 Last modified on

****************************************************************************************************/
(
  @user_id as int = 0
) RETURNS varchar(512)
AS
BEGIN
	declare @roles varchar(512)

	select
		@roles = COALESCE(@roles + ', ', '') + r.role
	from user_roles u
		join roles r on u.role_id = r.id
	where u.user_id = @user_id

	RETURN @roles
END

GO


