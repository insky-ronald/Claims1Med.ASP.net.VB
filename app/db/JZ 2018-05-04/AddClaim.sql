ALTER PROCEDURE [dbo].[AddClaim]  
/****************************************************************************************************
 Update History:

 30-JAN-2018
****************************************************************************************************/
@id int = 0 OUTPUT,
@claim_no varchar(20) = NULL OUTPUT,
@member_id int = 0,
@name_id int = 0,
@policy_id int = 0,
@client_id int = 0,
@product_code char(10) = '',
@plan_code char(15) = '',
@plan_code2 char(15) = '',
@sub_product char(15) = '',
@claim_type char(4) = '',
@base_currency_code char(3) = '',
@client_currency_code char(3) = '',
@eligibility_currency_code char(3) = '',
@notification_date datetime = NULL,
@country_of_incident char(3) = '',
@case_owner varchar(10) = '',
@status_code char(1) = '' OUTPUT,
@status varchar(20) = '' OUTPUT,
@hcm_reference varchar(15) = '',
@reference_no1 varchar(15) = '',
@reference_no2 varchar(15) = '',
@reference_no3 varchar(15) = '',
@third_party int = 0,

@is_accident tinyint = 0,
@accident_date datetime = NULL,
@accident_code varchar(10) = '',

/* MEDICAL */
@diagnosis_code varchar(10) = '000',
@is_preexisting tinyint = 0,
@first_symptom_date datetime = NULL,
@first_consultation_date datetime = NULL,

/* TRAVEL*/
@travel_departure_date datetime = NULL,
@travel_return_date datetime = NULL,

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

	IF @action = 0
	BEGIN
		EXEC [dbo].[CanDeleteClaim] 
			@id = @id,
			@change_plan = 0,
			@visit_id = @visit_id,
			@action_status_id = @action_status_id OUTPUT,
			@action_msg = @action_msg OUTPUT

		--set @action_status_id = -1
		--set @action_msg = 'Hello...'
		IF @action_status_id != 0 RETURN
	END

	-- convert @action to Medics can understand...
	IF @action = 20
		SET @action = 1
	ELSE IF @action = 10
		SET @action = 0
	ELSE IF @action = 0
		SET @action = 2

	EXECUTE [dbo].[ssp_claimmain_data_upd] 
	   @upd_mode = @action
	  ,@CLAIM_NO = @id OUTPUT
	  ,@CLAIM_REF = @claim_no OUTPUT
	  ,@IP_ID = @member_id
	  ,@COMP_ID = @name_id
	  ,@POLICY_ID = @policy_id
	  ,@CLIENT_ID = @client_id
	  ,@PROD_CODE = @product_code
	  ,@PLAN_CODE = @plan_code
	  ,@PLAN_CODE2 = @plan_code2
	  ,@SUB_PRODUCT = @sub_product
	  ,@CLM_TYPE = @claim_type
	  ,@BASE_CRCY = @base_currency_code
	  ,@CLT_CRCY = @client_currency_code
	  ,@ELG_CRCY = @eligibility_currency_code
	  ,@REC_DATE = @notification_date
	  ,@CASE_OWNER = @case_owner
	  ,@STATUS = @status_code OUTPUT
	  ,@StatusName = @status OUTPUT
	  ,@HCM_REF = @hcm_reference
	  ,@REF_NO1 = @reference_no1
	  ,@REF_NO2 = @reference_no2
	  ,@REF_NO3 = @reference_no3
	  ,@ThirdParty = @third_party
	  ,@InsertDate = @update_date
	  ,@InsertUser = @update_user
	  ,@UpdateDate = @update_date
	  ,@UpdateUser = @update_user

	EXECUTE [dbo].[ssp_claim_upd] 
	   @upd_mode = @action
	  ,@CLAIM_NO = @id
	  ,@IS_PREEXISTING = @is_preexisting
	  ,@IS_ACCIDENT = @is_accident
	  ,@SYMP1_DATE = @first_symptom_date
	  ,@CONSULT1_DATE = @first_consultation_date
	  ,@INC_DATE = @notification_date
	  ,@INC_CTRY = @country_of_incident
	  ,@ACCD_DATE = @accident_date
	  ,@ACCD_CODE = @accident_code
	  ,@ICD_CODE = @diagnosis_code
	  ,@CONDITION = ''
	  ,@TRV_DEP_DATE = @travel_departure_date
	  ,@TRV_RET_DATE = @travel_return_date
/*
	DECLARE @status_id int
	DECLARE @current_status char(1)
	DECLARE @old_claim_type char(4)

	IF @action = 10
	BEGIN
		SELECT
			@old_claim_type = claim_type,
			@status_id = status_id
		FROM claims
		WHERE id = @id

		UPDATE claims SET 
			member_id = @member_id,
			name_id = @name_id,
			policy_id = @policy_id,
			client_id = @client_id,
			product_code = @product_code,
			sub_product = @sub_product,
			plan_code = @plan_code,
			plan_code2 = @plan_code2,
			claim_type = @claim_type,
			base_currency_code = @base_currency_code,
			client_currency_code = @client_currency_code,
			eligibility_currency_code = @eligibility_currency_code,
			notification_date = @notification_date,
			case_owner = @case_owner,
			status_code = @status_code,
			status_id = @status_id,
			hcm_reference = @hcm_reference,
			reference_no1 = @reference_no1,
			reference_no2 = @reference_no2,
			reference_no3 = @reference_no3,
			update_date = @update_date,
			update_user = @update_user
		WHERE id = @id	
	END

	IF @action in (10, 20)
	BEGIN
		IF @claim_type = 'MED'
		BEGIN
			UPDATE claims SET 
				is_preexisting = @is_preexisting,
				is_accident = @is_accident,
				accident_date = @accident_date,
				accident_code = @accident_code,
				first_symptom_date = @first_symptom_date,
				first_consultation_date = @first_consultation_date
			WHERE id = @id	
		END ELSE IF @claim_type = 'TRV'
		BEGIN
			UPDATE claims SET 
				is_accident = @is_accident,
				accident_date = @accident_date,
				accident_code = @accident_code,
				travel_departure_date = @travel_departure_date,
				travel_return_date = @travel_return_date
			WHERE id = @id
		END
	END
*/
DONE:
	--SET @action_status_id = 100
	--SET @action_msg = 'Test'
END
