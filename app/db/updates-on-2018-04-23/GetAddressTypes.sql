ALTER PROCEDURE [dbo].[GetAddressTypes]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(3) = '',
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

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
	DECLARE @columns varchar(100) = '*'  
	DECLARE @where2 varchar(200) = ''

	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'code, address_type'
	END

	IF LEN(@code) > 0
	   SET @where2 = '[code] = ' + QUOTENAME(@code, '''')
    
	EXEC RunSimpleDynamicQuery
        @source = 'address_types',
		@columns = @columns,
        @filter = @filter,
        @where = '[code] like @filter or [address_type] like @filter',
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END






