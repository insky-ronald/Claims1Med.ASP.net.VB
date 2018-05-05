DROP PROCEDURE [dbo].[AddMember]
GO

CREATE PROCEDURE [dbo].[AddMember]  
/****************************************************************************************************
 Update History:
 ===============

****************************************************************************************************/
(
	@id int = 0 OUTPUT,
	@policy_id int = '',
	@plan_code varchar(15) = '',
	@name_id int = 0 OUTPUT,	
	@main_name_id int = 0,

	@sequence_no smallint = 0,
	@certificate_no varchar(25) = '' OUTPUT,
	@certificate_id int = 0 OUTPUT,
	@dependent_code smallint = 0 OUTPUT,
	@relationship_code char(2) = '',

	@inception_date datetime = NULL,
	@start_date datetime = NULL,
	@end_date datetime = NULL,
	@cancelation_name datetime = NULL,
	@reinstatement_date datetime = NULL,
	@status_code char(1) = '',
	@history_id int = 0 OUTPUT,

	@reference_no1 varchar(25) = '',
	@reference_no2 varchar(25) = '',
	@reference_no3 varchar(25) = '',

	@notes varchar(max) = '',
	@medical_history_notes varchar(max) = '',
	@underwriting_notes varchar(max) = '',

	@first_name varchar(30) = '',
	@middle_name varchar(30) = '',
	@last_name varchar(30) = '',

	--@MemberName varchar(100) = NULL,
	@gender char(1) = '',
	@dob datetime = NULL,
	@home_country_code char(3) = '',
	@nationality_code char(10) = '',
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

	EXECUTE [dbo].[ssp_member_data_upd] 
		@upd_mode = @action
		,@IP_ID = @id OUTPUT
		,@POLICY_ID = @policy_id
		,@PLAN_CODE = @plan_code
		,@COMP_ID = @name_id OUTPUT
		,@MAIN_ID = @main_name_id
		,@SEQ_NO = @sequence_no
		,@CERT_NO = @certificate_no OUTPUT
		,@CERT_ID = @certificate_id OUTPUT
		,@DEP_CODE = @dependent_code OUTPUT
		,@RELATION = @relationship_code
		,@INC_DATE = @inception_date
		,@EFF_DATE = @start_date
		,@EXP_DATE = @end_date
		,@CANCEL_DATE = @cancelation_name
		,@REINSTATE_DATE = @reinstatement_date
		,@STATUS = @status_code
		,@HIST_ID = @history_id OUTPUT
		,@REF_NO1 = @reference_no1
		,@REF_NO2 = @reference_no2
		,@REF_NO3 = @reference_no3
		--,@MEMO = @notes
		--,@UW_NOTES = @underwriting_notes
		--,@MED_HIST = @medical_history_notes
		,@FIRST_NAME = @first_name
		,@MIDDLE_NAME = @middle_name
		,@LAST_NAME = @last_name
		--,@MemberName
		,@SEX = @gender
		,@DOB = @dob
		,@HOME_CTRY = @home_country_code
		,@NAT_CODE = @nationality_code
		--,@ADDRESS_ID
		--,@CONTACT_ID
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user
		,@customer_service = 0
		,@AutoGenCert = 0

DONE:
	
END

GO


