DROP PROCEDURE [dbo].[AddServiceItem]
GO

/* =============================================*/
/* Author:		JZ*/
/* Create date: 2014-05-24*/
/* Description:	*/
/* =============================================*/
CREATE PROCEDURE [dbo].[AddServiceItem]
(
	@id int = 0 OUTPUT,
	@schedule_id int,
	@benefit_code char(10),
	@diagnosis_code char(10),
	@procedure_code char(10),
	@room_type char(5),
	@estimate_units smallint,
	@units smallmoney,
	@units_declined smallmoney,
	@units_approved smallmoney,
	@estimate money,
	@actual_amount money,
	@discount_percent smallmoney,
	@discount_amount money,
	@declined_amount money,
	@approved_amount money,
	@ex_gratia money,
	@deductible money,
	@payable money,
	@is_novalidate bit,
	@is_recover tinyint,
	@message text,
	@remarks text,
	@status_code char(1),
	@sub_status_code char(3),
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

	EXECUTE [dbo].[ssp_invoicedtl_upd] 
		@upd_mode = @action,
		@CLAIM_ID = @id,
		@SCHED_ID = @schedule_id,
		@BEN_CODE = @benefit_code,
		@ICD_CODE = @diagnosis_code,
		@CPT_CODE = @procedure_code,
		@ROOM_TYPE = @room_type,
		@EST_DAYS = @estimate_units,
		@UNITS = @units,
		@UNITS_DEC = @units_declined,
		@UNITS_APP = @units_approved,
		@ESTIMATE = @estimate,
		@CLM_AMOUNT = @actual_amount,
		@DISC_PER = @discount_percent,
		@DISC_AMOUNT = @discount_amount,
		@DEC_AMOUNT = @declined_amount,
		@APP_AMOUNT = @approved_amount,
		@EX_GRATIA = @ex_gratia,
		@DEDUCTIBLE = @deductible,
		@PAYABLE = @payable,
		@IS_NOVALIDATE = @is_novalidate,
		@IS_RECOVER = @is_recover,
		@MEMO = @message,
		@REMARKS = @remarks,
		@STATUS = @status_code,
		@STATUS_CODE = @sub_status_code,
		@UpdateDate = @update_date,
		@UpdateUser = @update_user
DONE:
END
GO
