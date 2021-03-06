DROP PROCEDURE [dbo].[GetServiceActions]
GO

CREATE PROCEDURE [dbo].[GetServiceActions] 
-- ***************************************************************************************************
-- Last modified on
-- 14-OCT-2014 ihms.0.0.1.0
-- *************************************************************************************************** 
(
    @id int = 0, 
	--@name_id int = 0, 
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

	IF LEN(@sort) = 0 SET @sort = 'action_type,action'
	IF LEN(@order) = 0 SET @order = 'asc'

	IF @id > 0
	BEGIN
		SET @param_id = @id
		SET @params = '@id int'
		SET @where = 'service_id = @id'
/*	END ELSE BEGIN
		SET @param_id = @name_id
		SET @params = '@name_id int'
		SET @where = 'name_id = @name_id' */
	END

	SET @sql = '
		SELECT
			*
		FROM v_service_actions
		WHERE
	' + @where + ' ORDER BY ' + @sort +' '+ @order

	EXEC sp_executesql @sql, @params, @param_id
END
GO
