DROP PROCEDURE [dbo].[AddGop] 
GO

CREATE PROCEDURE [dbo].[AddGop] 
/****************************************************************************************************
 Update History:

****************************************************************************************************/
@id int = 0 OUTPUT,
@sequence_no int = 0,
@claim_id int = 0,
@claim_type char(4) = '',
@service_type char(3) = '',
@service_no varchar(22) = '' OUTPUT,
@service_date datetime = null,
@version_no tinyint = 0,
@service_sub_type char(4) = '',
@document_type varchar(10) = '',
@start_date datetime = null,
@end_date datetime = null,
@provider_id int = 0,
@provider_contact_person varchar(100) = '',
@provider_fax_no varchar(20) = '',
@doctor_id int = 0,
@length_of_stay int = 0 OUTPUT,
@discount_type char(1) = '',
@discount_percent smallmoney = 0,
@discount_amount money = 0,
@claim_currency_code char(3) = '',
@claim_currency_to_base float = 0,
@claim_currency_to_client float = 0,
@claim_currency_to_eligibility float = 0,
@claim_currency_rate_date datetime = null,
@notes text = '',
@room_expense money = 0,
@misc_expense money = 0,
@hospital_medical_record varchar(30),
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

	EXECUTE [dbo].[ssp_gop_upd] 
		@upd_mode = @action
		,@INVOICE_ID = @id OUTPUT
		,@CLAIM_NO = @claim_id
		,@SEQ_NO = @sequence_no OUTPUT
		,@VER_NO = @version_no
		,@TRANS_DATE = @service_date
		,@TRANS_REF = @service_no OUTPUT
		,@CLM_TYPE = @claim_type
		,@CLM_SUB_TYPE = @service_sub_type
		,@DOC_TYPE = @document_type
		,@DISC_TYPE = @discount_type
		,@DISC_PER = @discount_percent
		,@DISC_AMOUNT = @discount_amount
		,@CLM_RATE_DATE = @claim_currency_rate_date
		,@CLM_TO_BAS = @claim_currency_to_base
		,@CLM_TO_CLT = @claim_currency_to_client
		,@CLM_TO_ELG = @claim_currency_to_eligibility
		--,@SET_ADVICE_ID = @settlement_advice_id
		--,@ADMIT_FIRST_CALL = 
		--,@ADMIT_DOC_RCVD = 
		--,@ADSENDING_DOC = 
		--,@ADDOC_REC2 = 
		--,@ADDOC_REC3 = 
		--,@ADMIN_INITIAL_GOP = 
		--,@ADMIT_TAT_FIRST_CALL =  OUTPUT
		--,@ADMIT_TAT_DOC_COMP =  OUTPUT
		--,@DISCH_FIRST_CALL = 
		--,@DISCH_DOC_RCVD = 
		--,@DISSENDING_DOC = 
		--,@DISDOC_REC2 = 
		--,@DISDOC_REC3 = 
		--,@DISCH_FINAL_GOP = 
		--,@DISCH_TAT_FIRST_CALL =  OUTPUT
		--,@DISCH_TAT_DOC_COMP =  OUTPUT
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user

	DECLARE @waiting_period varchar(200) -- temporary
	DECLARE @provider_name varchar(100) -- temporary
	DECLARE @doctor_name varchar(100) -- temporary
	DECLARE @gop_name varchar(60) -- temporary

	SELECT
		@provider_name = p.name,
		@doctor_name = d.name,
		@gop_name = t.document_type
	FROM providers p, providers d, document_types t
	WHERE p.id = @provider_id and d.id = @doctor_id and t.code = @document_type

	EXECUTE [dbo].[ssp_gop_med_upd] 
		@upd_mode = @action
		,@INVOICE_ID = @id
		,@DAY_IN = @start_date
		,@DAY_OUT = @end_date
		,@PROV_ID = @provider_id
		--,@DISC_TYPE = @
		--,@DISC_PER = @
		--,@DISCOUNT = @
		--,@DISC_AMOUNT = @
		,@GOP_NAME = @gop_name
		,@PROVIDER_NAME = @provider_name
		,@DOC_ID = @doctor_id
		,@DOCTOR_NAME = @doctor_name
		,@DOC_CONTACT = @provider_contact_person
		,@DOC_FAX_NO = @provider_fax_no
		--,@ICD_DESC = @
		--,@ICD_CODE = @
		,@REMARKS = @notes
		,@CLM_CRCY = @claim_currency_code
		,@ROOM_EXP = @room_expense
		,@MISC_EXP = @misc_expense
		,@LENGTH_OF_STAY = @length_of_stay OUTPUT
		,@WAITING_PERIOD = @waiting_period OUTPUT
		,@HOSP_MEDICAL_RECORD = @hospital_medical_record
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user

DONE:
END
GO
