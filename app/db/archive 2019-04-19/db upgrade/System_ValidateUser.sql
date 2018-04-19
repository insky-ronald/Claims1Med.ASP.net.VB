DROP PROCEDURE [dbo].[System_ValidateUser]
GO

CREATE PROCEDURE [dbo].[System_ValidateUser]
(
	@user_id int = 0 OUTPUT,
	@user_name varchar(10) = '' OUTPUT,
	@update_date datetime = NULL OUTPUT,
    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete;*/
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(2048) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		@user_id = user_id,
		@user_name = user_name
	FROM visits WHERE id = @visit_id

    SET @action_msg = ''
    SET @action_status_id = 0

    /* IF NOT @action IN (0, 10, 20)
	BEGIN
        SET @action_status_id = -250 /* invalid request*/
		SET @action_msg = 'Invalid action request'
	END */
END

GO

