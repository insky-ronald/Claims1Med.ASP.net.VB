DROP PROCEDURE [dbo].[AddUserRoles]
GO

CREATE PROCEDURE [dbo].[AddUserRoles]
(
	@user_id AS int = 0,
	@role_ids AS varchar(200) = '',
    @visit_id as bigint = 0,
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(200) = '' OUTPUT
)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @this_user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @this_module_id AS int = 2

	SET @action_msg = ''
	SET @action_status_id = 0

	DELETE user_roles WHERE user_id = @user_id

	INSERT INTO user_roles(
		user_id,
		role_id,
		insert_visit_id,
		inserted_at)
	SELECT
		@user_id,
		value,
		@visit_id,
		getdate()
	FROM dbo.f_split(@role_ids, ',')
END
GO
