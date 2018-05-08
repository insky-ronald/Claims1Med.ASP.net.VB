DROP PROCEDURE [dbo].[AddClaimDiagnosis]
GO

CREATE PROCEDURE [dbo].[AddClaimDiagnosis]
(
	@id int = 0 OUTPUT,
	@claim_id int = 0,
	@service_id int = 0,
	@type char(1) = 'I',
	@diagnosis_group char(10) = '',
	@diagnosis_code char(10) = '',
	@condition text = '',
	@is_default bit = 0,
	@surgical_type char(3) = '',
	@doctor_id int = 0,
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
	
	--SET @type = 'I'
	SET @condition = ''

	-- convert @action to Medics can understand...
	IF @action = 20
		SET @action = 1 -- add
	ELSE IF @action = 10
		SET @action = 0 -- edit
	ELSE IF @action = 0
		SET @action = 2 -- delete

	IF @action IN (0,2) 
	BEGIN
		IF @type = 'I'
			SELECT
				@claim_id = d.claim_id,
				@service_id = d.service_id
			FROM claim_diagnosis d
			WHERE d.id = @id
		ELSE
			SELECT
				@claim_id = d.claim_id,
				@service_id = d.service_id
			FROM claim_procedures d
			WHERE d.id = @id
	END

	IF @action = 2 AND @type = 'I' -- delete
	BEGIN
		DECLARE @diagnosis_count int
		SELECT
			@diagnosis_count = COUNT(*)
		FROM claim_diagnosis d
		JOIN services s on d.service_id = s.id and d.diagnosis_group = s.diagnosis_code
		WHERE d.service_id = @service_id and d.diagnosis_group = @diagnosis_group

		--IF EXISTS(SELECT * FROM services WHERE id = @service_id and diagnosis_code = @diagnosis_group)
		IF @diagnosis_count = 1
		BEGIN
			SET @action_status_id = -10
			SET @action_msg = 'Cannot delete the default diagnosis'
			RETURN
		END

		SET @service_id = NULL -- This is required in Medics to work...
	END
	/*
	IF @action = 2 AND @type = 'P' -- delete
	BEGIN
		SELECT
			@diagnosis_code = d.diagnosis_group,
			@diagnosis_group = d.diagnosis_code
		FROM claim_diagnosis d
		WHERE d.id = @id
	END
	*/
	--SET @action_status_id = -1
	--SET @action_msg = @action
	--RETURN

	EXECUTE [dbo].[ssp_claimdiagnosis_upd] 
		@upd_mode = @action
		,@RECORD_ID = @id OUTPUT
		,@CLAIM_NO = @claim_id
		,@INVOICE_ID = @service_id
		,@DIAGNOSIS_TYPE = @type
		,@ICD_GROUP = @diagnosis_group
		,@ICD_CODE = @diagnosis_code
		,@CONDITION = @condition
		,@IS_DEFAULT = @is_default
		,@SURG_TYPE = @surgical_type
		,@DOCTOR_ID = @doctor_id
		,@InsertDate = @update_date
		,@InsertUser = @update_user
		,@UpdateDate = @update_date
		,@UpdateUser = @update_user
DONE:
END
GO
