DROP PROCEDURE [dbo].[GetPlans]
GO

CREATE PROCEDURE [dbo].[GetPlans]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(10) = '',
	@product_code varchar(10) = '',
	@filter as varchar(100) = '',
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'code',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @action in (10,20,50)
	BEGIN
		SELECT
			*
		FROM v_plans
		WHERE code = @code

		RETURN
	END
	
	DECLARE @user_id AS int = 0
	DECLARE @columns varchar(100) = '*'  
	DECLARE @where2 varchar(200) = ''
	
	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @where2 = 'status_id = 1'
		SET @columns = 'code, plan_name, currency_code, product_code, product_name, client_name'
	END

	IF LEN(@code) > 0
		IF LEN(@where2) > 0
			SET @where2 = @where2 + ' AND [code] = ' + QUOTENAME(@code, '''')
		ELSE
			SET @where2 = '[code] = ' + QUOTENAME(@code, '''')

	IF LEN(@product_code) > 0
		IF LEN(@where2) > 0
			SET @where2 = @where2 + ' AND [client_id] = ' + QUOTENAME(@product_code, '''')
		ELSE
			SET @where2 = '[client_id] = ' + QUOTENAME(@product_code, '''')
    
	EXEC RunSimpleDynamicQuery
        @source = 'v_plans',
		@columns = @columns,

        @filter = @filter,
        @where = '[code] like @filter or [plan_name] like @filter or [product_name] like @filter or [client_name] like @filter',
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END
GO
