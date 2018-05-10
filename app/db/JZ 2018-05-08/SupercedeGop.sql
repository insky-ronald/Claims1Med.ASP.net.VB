DROP PROCEDURE [dbo].[SupercedeGop]
GO

CREATE PROCEDURE [dbo].[SupercedeGop]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@new_id int = 0 OUTPUT,
    @visit_id as bigint = 0,
	@action_status_id as int = 0 OUTPUT,
	@action_msg as varchar(2048) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
	--SET @action_status_id = -1
	--SET @action_msg = 'HELLO'
	--SET @new_id = @id
	--RETURN

	DECLARE @user_name varchar(10)

	SELECT
		@user_name = u.user_name
	FROM visits v
	JOIN users u on v.user_id = u.id
	WHERE v.id = @visit_id

	EXECUTE [dbo].[ssp_gop_supercede] 
		@GOP_ID = @id
		,@NEW_GOP_ID = @new_id OUTPUT
		,@USER_NAME = @user_name

END
GO
