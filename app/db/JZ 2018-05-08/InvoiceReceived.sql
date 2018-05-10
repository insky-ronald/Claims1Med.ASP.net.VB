DROP PROCEDURE [dbo].[InvoiceReceived]
GO

CREATE PROCEDURE [dbo].[InvoiceReceived]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@new_id int = 0 OUTPUT,
	@service_no varchar(20) OUTPUT,
	@service_sub_type char(4) = '',
    @visit_id as bigint = 0,
	@action_status_id as int = 0 OUTPUT,
	@action_msg as varchar(2048) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
	--SET @action_status_id = -1
	--SET @action_msg = @service_sub_type
	--SET @new_id = @id
	--RETURN

	DECLARE @user_name varchar(10)

	SELECT
		@user_name = u.user_name
	FROM visits v
	JOIN users u on v.user_id = u.id
	WHERE v.id = @visit_id

	EXECUTE [dbo].[ssp_gop_receive_invoice] 
		@GOP_ID = @id
		,@INVOICE_ID = @new_id OUTPUT
		,@TRANS_REF = @service_no OUTPUT
		,@SERVICE_TYPE = @service_sub_type
		,@USER_NAME = @user_name

END
GO
