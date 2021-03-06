DROP PROCEDURE [dbo].[System_Login]
GO

CREATE PROCEDURE [dbo].[System_Login]
-- ***************************************************************************************************
-- Last modified on
-- 07-MAR-2017
-- *************************************************************************************************** 
(
  @user_id as int = -20 output, /* presume authentication failed*/
  @user_name as varchar(200) = '',
  @password as varchar(200) = '',

  @visit_id as bigint = 0 /* mandatory*/
)
AS
BEGIN
	SET NOCOUNT ON;

	SET @user_id = -1

	SELECT
		@user_id = id
	FROM user_login_info
	WHERE user_name = @user_name

	IF @user_id > 0
		UPDATE dbo.visits SET
			user_id = @user_id, 
			logged_in_at = GETDATE(), 
			connected = 1
		WHERE id = @visit_id

	/*
	EXECUTE INSKY02.[dbo].Login
	  @user_id = @user_id output,
	  @user_name = @user_name,
	  @password = @password,
	  @visit_id = @visit_id

	if @user_id > 0
	begin
		if exists(select * from INSKY02.[dbo].user_details where user_id = @user_id and status_code_id = 10)
			update dbo.visits set user_id = @user_id, [logged_in_at] = GETDATE(), connected = 1 where [id] = @visit_id
		else
			set @user_id = 0
	end
	*/

END

