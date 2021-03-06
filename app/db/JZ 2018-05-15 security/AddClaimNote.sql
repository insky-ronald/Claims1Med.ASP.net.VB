USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[AddClaimNote]
GO

CREATE PROCEDURE [dbo].[AddClaimNote]
/****************************************************************************************************
 Update History:
 ===============

****************************************************************************************************/
(
	@id int = 0 OUTPUT,
	@claim_id int = 0,
	@service_id int = 0,
	@note_type char(3) = '',
	@note_sub_type char(3) = '',
	@notes varchar(max) = '',
	@is_new bit = 0,

    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete;*/
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(200) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @user_id AS int = 0
	DECLARE @update_user AS varchar(10) = ''
	DECLARE @update_date datetime = GETDATE()    

	--SET @action_status_id = -1
	--SET @action_msg = 'xxx'
	--return

	EXEC [dbo].[System_ValidateUser]
		@user_id = @user_id OUTPUT,
		@user_name = @update_user OUTPUT,
		@action = @action,
		@visit_id = @visit_id,
		@action_status_id = @action_status_id OUTPUT,
		@action_msg = @action_msg OUTPUT

	IF @action_status_id != 0 GOTO DONE

	-- convert @action to Medics can understand...
	IF @action = 20
		SET @action = 1
	ELSE IF @action = 10
		SET @action = 0
	ELSE IF @action = 0
		SET @action = 2

	IF @claim_id = 0 and @service_id > 0
	BEGIN
		SELECT
			@claim_id = claim_id
		FROM services WHERE id = @service_id
	END

	EXECUTE [dbo].[ssp_clmnotes_upd] 
		@upd_mode = @action
		,@NOTE_ID = @id OUTPUT
		,@CLAIM_NO = @claim_id
		,@INVOICE_ID = @service_id
		,@NOTE_CODE = @note_type
		,@SUB_CODE = @note_sub_type
		,@NOTES = @notes
		,@CanEdit = @is_new
		--,@IsDeleted
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user

DONE:
END

GO
