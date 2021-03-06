DROP PROCEDURE [dbo].[ChangeServiceStatus]
GO

CREATE PROCEDURE [dbo].[ChangeServiceStatus]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@status_code char(1) = '',
	@sub_status_code char(3) = '',
    @visit_id as bigint = 0,
	@action_status_id as int = 0 OUTPUT,
	@action_msg as varchar(2048) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
	--SET @action_status_id = -1
	--SET @action_msg = 'HELLO'
	--RETURN

	DECLARE @user_name varchar(10)
	DECLARE @update_date datetime = getdate()

	SELECT
		@user_name = u.user_name
	FROM visits v
	JOIN users u on v.user_id = u.id
	WHERE v.id = @visit_id

	DECLARE @service_type char(3)
	DECLARE @old_status_code char(1)
	DECLARE @old_sub_status_code char(3)
	SELECT
		@service_type = service_type,
		@old_status_code = status_code,
		@old_sub_status_code = sub_status_code
	FROM services 
	WHERE id = @id

	EXECUTE [dbo].[ssp_invoice_status_upd] 
		@MODULE_ID = @service_type
		,@INVOICE_ID = @id
		,@STATUS = @old_status_code
		,@STATUS_CODE = @old_sub_status_code
		,@NEW_STATUS = @status_code
		,@NEW_STATUS_CODE = @sub_status_code
		,@UpdateDate = @update_date
		,@UpdateUser = @user_name
		,@ErrCode = @action_status_id OUTPUT
		,@ErrMessage = @action_msg OUTPUT

	SET @action_status_id = -@action_status_id
	IF @service_type = 'INV' and @status_code = 'E' and @sub_status_code = 'E01'
	BEGIN
		SET @action_msg = replace(replace(@action_msg, '"', ''''), char(13)+char(10), '<br>')
	END

END
GO
