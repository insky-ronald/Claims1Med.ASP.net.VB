USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[AddServiceAction]
GO

CREATE PROCEDURE [dbo].[AddServiceAction]
/****************************************************************************************************
 Update History:
 ===============

****************************************************************************************************/
(
	@id int = 0 OUTPUT,
	@service_id int = 0,
	@action_type_code char(3) = '',
	@action_code char(3) = '',
	@action_owner varchar(10) = '',
	@due_date datetime = NULL,
	@notes varchar(max) = '',	

    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete; 100 = complete action*/
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

	IF @action = 0
	BEGIN
		UPDATE service_actions SET
			is_done = 'X',
			completion_user = @update_user,
			completion_date = @update_date,
			update_user = @update_user,
			update_date = @update_date
		WHERE id = @id

		RETURN
	END

	IF @action = 100
	BEGIN
		UPDATE service_actions SET
			is_done = 'D',
			completion_user = @update_user,
			completion_date = @update_date,
			update_user = @update_user,
			update_date = @update_date
		WHERE id = @id

		RETURN
	END

	IF @action = 101
	BEGIN
	--SET @action_status_id = -1
	--SET @action_msg = 'Change action owner'
		UPDATE service_actions SET
			action_owner = @action_owner,
			notes = @notes,
			update_user = @update_user,
			update_date = @update_date
		WHERE id = @id
		
		RETURN
	END

	-- convert @action to Medics can understand...
	IF @action = 20
		SET @action = 1
	ELSE IF @action = 10
		SET @action = 0
	ELSE IF @action = 0
		SET @action = 2


	EXECUTE [dbo].[ssp_invoice_action_upd] 
		@upd_mode = @action
		,@INVOICE_ID = @service_id
		--,@ACTION_CLASS = @action_type_code
		--,@ACTION_CODE = @action_code
		--,@ACTION_OWNER = @action_owner
		--,@DUE_DATE = @due_date
		,@NEW_ACTION_CLASS = @action_type_code
		,@NEW_ACTION_CODE = @action_code
		,@NEW_ACTION_OWNER = @action_owner
		,@NEW_DUE_DATE = @due_date
		,@NEW_ACTION_NOTES = @notes
		--,@CHANGE_ACTION_ID
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user
		,@ErrCode = @action_status_id OUTPUT
		,@ErrMessage = @action_msg OUTPUT

DONE:
END

GO
