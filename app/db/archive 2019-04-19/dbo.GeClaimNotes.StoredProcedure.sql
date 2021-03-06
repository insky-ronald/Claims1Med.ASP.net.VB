SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GeClaimNotes] 
-- ***************************************************************************************************
-- Last modified on
-- 23-MAR-2016
-- *************************************************************************************************** 
(
    @claim_id int = 0, 
	@service_id int = 0, 
	@sort varchar(200) = '',
	@order varchar(10) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    DECLARE @where AS varchar(100)
	DECLARE @sql nvarchar(MAX)
	DECLARE @params nvarchar(max)
	DECLARE @param_id int

	IF LEN(@sort) = 0 SET @sort = 'reference_no'
	IF LEN(@order) = 0 SET @order = 'asc'

	IF @service_id = 0
	BEGIN
		SET @param_id = @claim_id
		SET @params = '@claim_id int'
		SET @where = 'claim_id = @claim_id'
	END ELSE BEGIN
		SET @param_id = @service_id
		SET @params = '@service_id int'
		SET @where = 'service_id = @service_id'
	END

	SET @sql = '
		SELECT
			*
		FROM v_claim_notes
		WHERE
	' + @where + ' ORDER BY ' + @sort +' '+ @order

	EXEC sp_executesql @sql, @params, @param_id
END

GO
