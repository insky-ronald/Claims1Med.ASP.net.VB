DROP PROCEDURE [dbo].[GetServiceStatusHistory]
GO

CREATE PROCEDURE [dbo].[GetServiceStatusHistory] 
-- ***************************************************************************************************
-- Last modified on
-- 29-SEP-2017
-- *************************************************************************************************** 
(
    @id int = 0, 
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

	IF LEN(@sort) = 0 SET @sort = 'create_date'
	IF LEN(@order) = 0 SET @order = 'desc'

	IF @id > 0
	BEGIN
		SET @param_id = @id
		SET @params = '@id int'
		SET @where = 'service_id = @id'
	END

	SET @sql = '
		SELECT
			*
		FROM v_service_status_history
		WHERE
	' + @where + ' ORDER BY ' + @sort +' '+ @order

	EXEC sp_executesql @sql, @params, @param_id
END
GO
