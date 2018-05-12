DROP PROCEDURE [dbo].[AddInvoice] 
GO

CREATE PROCEDURE [dbo].[AddInvoice] 
/****************************************************************************************************
 Update History:

****************************************************************************************************/
@id int = 0 OUTPUT,
--@sequence_no int,
@claim_id int,
@claim_type char(4),
--@service_type char(3),
@service_no varchar(22) OUTPUT,
--@service_date datetime,
--@version_no tinyint,
@service_sub_type char(4),
--@document_type varchar(10),
@reference_no1 varchar(20),
--@link_gop_id int,
@start_date datetime,
@end_date datetime,
--@diagnosis_code varchar(10),
--@diagnosis_notes text,
--@final_diagnosis_code varchar(10),
--@final_diagnosis_notes text,
--@procedure_code varchar(10),
--@procedure_notes text,
@provider_id int,
--@provider_contact_person varchar(100),
--@provider_fax_no varchar(20),
@doctor_id int,
--@length_of_stay int,
@treatment_country_code char(3),
@invoice_no varchar(15),
@invoice_date datetime,
@invoice_received_date datetime,
@invoice_entry_date datetime,
@invoice_entry_user char(10),
@discount_type char(1),
@discount_percent smallmoney,
@discount_amount money,
@claim_currency_code char(3),
@claim_currency_to_base float,
@claim_currency_to_client float,
@claim_currency_to_eligibility float,
@claim_currency_rate_date datetime,
@claim_currency_manual_rate bit,
--@actual_amount money,
--@approved_amount money,
--@paid_amount money,
--@settlement_currency_code char(3),
--@settlement_currency_to_claim float,
--@settlement_currency_to_base float,
--@settlement_currency_to_client float,
--@settlement_currency_to_eligibility float,
--@settlement_currency_rate_date datetime,
--@settlement_currency_manual_rate bit,
@status_code char(1),
@sub_status_code char(3),
--@status_date datetime,
--@status_user varchar(10),
@medical_type char(1),
@delivery_type char(1),
@room_type char(1),
--@float_id int,
--@payment_id int,
--@payee_type char(1),
--@payee_id int,
--@payee_name varchar(100),
@payment_mode char(1),
--@is_recovery tinyint,
--@is_exgratia bit,
--@is_emergency bit,
@is_accident bit,
--@is_surgical bit,
--@authorize_user varchar(10),
--@authorize_date datetime,
--@batch_id int,
--@batch_user varchar(10),
--@batch_date datetime,
--@settlement_advice_id int,
@settlement_advice_notes text,

@action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete; */
@visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
@action_status_id as int = 0 OUTPUT,
@action_msg as varchar(200) = '' OUTPUT
AS
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

	--SET @action_status_id = -1
	--SET @action_msg = 'Not yet implemented!'
	--RETURN

	EXECUTE [dbo].[ssp_invoice_upd]
		@upd_mode = @action
		,@CLAIM_NO = @claim_id
		,@INVOICE_ID = @id  OUTPUT
		,@TRANS_REF = @service_no  OUTPUT
		--,@HIST_ID not needed
		,@REF_NO1 = @reference_no1
		,@INVOICE_NO = @invoice_no
		,@INV_DATE = @invoice_date
		,@REC_DATE = @invoice_received_date
		,@INV_INP_DATE = @invoice_entry_date
		,@INV_INP_BY = @invoice_entry_user
		,@DISC_TYPE = @discount_type
		,@DISC_PER = @discount_percent
		,@DISC_AMOUNT = @discount_amount
		,@INV_PAY_TYPE = @payment_mode
		,@STATUS = @status_code  OUTPUT
		,@STATUS_CODE = @sub_status_code  OUTPUT
		,@CLM_TYPE = @claim_type
		,@CLM_SUB_TYPE = @service_sub_type
		,@CLM_CRCY = @claim_currency_code
		,@CLM_RATE_DATE = @claim_currency_rate_date
		,@CLM_TO_BAS = @claim_currency_to_base
		,@CLM_TO_CLT = @claim_currency_to_client
		,@CLM_TO_ELG = @claim_currency_to_eligibility
		,@SET_ADVICE_NOTES = @settlement_advice_notes
		--,@PROV_INVOICE_ID = @
		,@PROVIDER_ID = @provider_id
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user

	DECLARE @waiting_period varchar(200) -- temporary
	DECLARE @provider_name varchar(100) -- temporary
	DECLARE @doctor_name varchar(100) -- temporary

	SELECT
		@provider_name = name
	FROM providers
	WHERE id = @provider_id

	SELECT
		@doctor_name = name
	FROM providers
	WHERE id = @doctor_id

	EXECUTE [dbo].[ssp_invoice_custom_med_upd]
		@upd_mode = @action
		,@CLAIM_NO = @claim_id
		,@INVOICE_ID = @id
		,@CLM_TYPE = @claim_type
		,@CLM_SUB_TYPE = @service_sub_type
		,@PROV_ID = @provider_id
		,@PROVIDER_NAME = @provider_name
		,@DISCOUNT = @discount_percent
		,@DISC_TYPE = @discount_type
		--,@DISC_PER = @discount_percent
		,@DOC_ID = @doctor_id
		,@DOCTOR_NAME = @doctor_name
		,@DELIVERY_TYPE = @delivery_type
		,@MEDICAL_TYPE = @medical_type
		,@ROOM_TYPE = @room_type
		,@DAY_IN = @start_date
		,@DAY_OUT = @end_date
		,@TREAT_CTRY = @treatment_country_code
		--,@CPT_CODE = @
		--,@CPT_DESC = @
		--,@IS_EMERGENCY = @is_emergency
		,@IS_ACCIDENT = @is_accident
		--,@IS_SURGICAL = @
		--,@IS_EXGRATIA = @
		--,@NO_VALIDATE = @
		,@WAITING_PERIOD = @waiting_period OUTPUT

DONE:
END

GO


