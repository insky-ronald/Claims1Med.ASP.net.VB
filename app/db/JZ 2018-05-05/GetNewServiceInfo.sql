DROP PROCEDURE [dbo].[GetNewServiceInfo]
GO

CREATE PROCEDURE [dbo].[GetNewServiceInfo]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@claim_id as int = 0,
	@service_type varchar(3) = '',
	@service_sub_type varchar(4) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_id AS int

	SELECT
		@user_id = user_id
	FROM visits
	WHERE id = @visit_id

END
GO
