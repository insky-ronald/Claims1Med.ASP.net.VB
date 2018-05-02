DROP PROCEDURE [dbo].[AuthorizeBatchInvoice]
GO

CREATE PROCEDURE [dbo].[AuthorizeBatchInvoice]
	@id int = 0,
	@authorise int = 1,
	@module char(3) = 'INV', -- INV or CAS
    @visit_id as bigint = 0,
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(2048) = '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	
    /* SET @action_status_id = 100
    SET @action_msg = 'TEST'
	RETURN */

	DECLARE @user_name varchar(10)

	SELECT
		@user_name = v.user_name
	FROM visits v 
	WHERE v.id = @visit_id

	EXECUTE [dbo].[sp_check_batch_auth] 
		@INVOICE_ID = @id,
		@BATCH_READY = @authorise,
		@MODULE_ID = @module,
		@UpdateUser = @user_name,
		@ErrCode = @action_status_id OUTPUT,
		@ErrMessage = @action_msg OUTPUT

END
GO
