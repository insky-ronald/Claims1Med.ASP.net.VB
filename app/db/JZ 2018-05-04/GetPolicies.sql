ALTER PROCEDURE [dbo].[GetPolicies]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@client_id int = 0,
	@filter as varchar(100) = '',
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'policy_no',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @action in (10,20,50)
	BEGIN
		SELECT
			p.*
		FROM v_policies p
		WHERE p.id = @id

		RETURN
	END

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
	DECLARE @columns varchar(100) = '*'  
	DECLARE @where2 varchar(200) = '[id] in (select id from v_valid_policies)'

	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'policy_no, product_name, start_date, end_date'
	END

	IF @id > 0
	   SET @where2 = '[id] = ' + CAST(@id as varchar)
    
	EXEC RunSimpleDynamicQuery
        @source = 'v_policies',
		@columns = @columns,

        @filter = @filter,
        @where = '[product_name] like @filter',
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END
GO
