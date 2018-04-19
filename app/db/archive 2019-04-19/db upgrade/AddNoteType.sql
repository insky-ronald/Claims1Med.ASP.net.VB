DROP PROCEDURE [dbo].[AddNoteType]  
GO

/****** Object:  StoredProcedure [dbo].[AddNoteType]    Script Date: 8/15/2017 10:47:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/* =============================================*/
/* Author:		JZ*/
/* Create date: 2014-05-24*/
/* Description:	*/
/* =============================================*/
CREATE PROCEDURE [dbo].[AddNoteType]  
(
	@code char(3) = '',
    @note_type as varchar(60) = '' ,
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete;*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(2048) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @user_id AS int
	DECLARE @user_name AS varchar(10)

	EXEC System_ValidateUser
		@user_id = @user_id OUTPUT,
		@user_name = @user_name OUTPUT,
		@action = @action,
		@visit_id = @visit_id,
		@action_status_id = @action_status_id OUTPUT,
		@action_msg = @action_status_id OUTPUT

	IF @action_status_id < 0 GOTO DONE

	IF @action = 20 /* insert */
	BEGIN
		INSERT INTO note_types (
			code,
			note_type,
			create_user,
			create_date
		) values (
			@code,
			@note_type,
			@user_name,
			getdate()
		)
    END ELSE IF @action = 10 /* update */
    BEGIN
		UPDATE note_types set
			note_type = @note_type,
			update_user = @user_name,
			update_date = getdate()
        WHERE code = @code
	END ELSE IF @action = 0 /* update */
	BEGIN
		DELETE note_types WHERE code = @code
    END
    
DONE:
    --IF @action_status_id < 0
    --BEGIN
        --DECLARE @error_log_id AS int
        --EXEC dbo.LogError @error_log_id OUTPUT, @action_status_id, '', 0, @visit_id 
        --SET @action_msg = dbo.F_GetErrorLog(@error_log_id)
    --END    
END


GO

