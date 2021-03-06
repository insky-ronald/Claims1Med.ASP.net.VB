USE [MEDICS52]
GO
/****** Object:  StoredProcedure [dbo].[GetServiceActions]    Script Date: 5/25/2018 4:05:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetServiceActions] 
-- ***************************************************************************************************
-- Last modified on
-- 14-OCT-2014 ihms.0.0.1.0
-- *************************************************************************************************** 
(
    @id int = 0, 
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

	IF @id > 0
	BEGIN
		SELECT
			*
		FROM service_actions
		WHERE id = @id

		RETURN
	END

	IF @service_id > 0
	BEGIN
		SET @param_id = @service_id
		SET @params = '@id int'
		SET @where = 'service_id = @id'
	END

	IF LEN(@sort) = 0 SET @sort = 'action_type,action'
	IF LEN(@order) = 0 SET @order = 'asc'

	SET @sql = '
		SELECT
			*
		FROM v_service_actions
		WHERE
	' + @where + ' ORDER BY ' + @sort +' '+ @order

	EXEC sp_executesql @sql, @params, @param_id
END


