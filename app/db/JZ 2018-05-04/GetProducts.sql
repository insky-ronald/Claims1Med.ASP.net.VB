ALTER PROCEDURE [dbo].[GetProducts]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(10) = '',
	@client_id int = 0,
	@filter as varchar(100) = '',

	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'product_name',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @action in (10,20,50)
	BEGIN
		SELECT
			r.*,
			n.full_name as client_name,
			f.float_name
		FROM products r
		join names n on r.client_id = n.id
		left outer join floats f on r.float_id = f.id
		WHERE r.code = @code

		RETURN
	END
	
	DECLARE @user_id AS int = 0
	DECLARE @columns varchar(100) = '*'  
	DECLARE @where2 varchar(200) = ''
	
	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'code, product_name, client_name'
	END

	IF LEN(@code) > 0
	   SET @where2 = '[code] = ' + QUOTENAME(@code, '''')

	IF @client_id > 0
		IF LEN(@where2) > 0
			SET @where2 = @where2 + ' AND [client_id] = ' + STR(@client_id)
		ELSE
			SET @where2 = '[client_id] = ' + STR(@client_id)
    
	EXEC RunSimpleDynamicQuery
        @source = 'v_products',
		@columns = @columns,

        @filter = @filter,
        @where = '[name] like @filter',
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END
GO
