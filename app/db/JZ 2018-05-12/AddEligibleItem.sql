DROP PROCEDURE [dbo].[AddEligibleItem]
GO

/* =============================================*/
/* Author:		JZ*/
/* Create date: 2014-05-24*/
/* Description:	*/
/* =============================================*/
CREATE PROCEDURE [dbo].[AddEligibleItem]
(
	@id int = 0 OUTPUT,
	@service_id int = 0,
	@schedule_id int = 0,
	@benefit_code varchar(15) = '',
	@diagnosis_code varchar(10) = '',
	@units_required bit = 0,
	@units smallmoney = 0,
	@amount money = 0,
	@is_split bit = 0,
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

	EXECUTE [dbo].[ssp_service_detail_schedule_upd] 
		@upd_mode = @action
		,@CLAIM_ID = @id OUTPUT
		,@INVOICE_ID = @service_id
		,@SCHED_ID = @schedule_id
		,@BEN_CODE = @benefit_code
		,@ICD_CODE = @diagnosis_code
		,@UNITS_REQD = @units_required
		,@UNITS = @units
		,@AMOUNT = @amount
		,@IS_SPLIT = @is_split
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user
DONE:
END
GO
