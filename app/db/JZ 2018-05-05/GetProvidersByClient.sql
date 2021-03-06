DROP PROCEDURE [dbo].[GetProvidersByClient]
GO

CREATE PROCEDURE [dbo].[GetProvidersByClient]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@client_id int = 0,
	@provider_types varchar(100) = '',
	@status_code char(1) = '',
	@category int = 0,
	@filter as varchar(100) = '',

    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'name',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	--DECLARE @user_id AS int = 0
	--DECLARE @where nvarchar(500) = '[name] like @filter or [specialisation] like @filter or [country] like @filter'
	DECLARE @source varchar(100) = 'v_providers_by_client'
	DECLARE @where nvarchar(500) = '[name] like @filter'
	DECLARE @where2 nvarchar(500)
	DECLARE @columns varchar(100) = '*' 

	IF @category = 1
		SET @source = 'v_providers'

	--IF @category > 0
		--EXEC RunDynamicQueryBuilder1 @name='category', @value=@category, @type='n', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT

	IF LEN(@filter) = 0 and LEN(@status_code) = 0 and LEN(@provider_types) = 0 and @category=0 and @id > 0
	BEGIN
		SET @source = 'v_providers'
		EXEC RunDynamicQueryBuilder1 @name='id', @value=@id, @type='n', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT
		--SET @where2 = 'id = ' + CAST(@id as varchar)
	END

	IF @source = 'v_providers_by_client'
	BEGIN
		IF @source = 'v_providers_by_client'
			EXEC RunDynamicQueryBuilder1 @name='client_id', @value=@client_id, @type='n', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT

		EXEC RunDynamicQueryBuilder1 @name='provider_type', @value=@provider_types, @type='c', @logic='and', @operator='in', @brackets= 0, @where=@where2 OUTPUT
		EXEC RunDynamicQueryBuilder1 @name='network_status_code', @value=@status_code, @type='c', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT
	END ELSE
	BEGIN
		IF LEN(@provider_types) = 0
			EXEC RunDynamicQueryBuilder1 @name='provider_type', @value='H,K,PHA', @type='c', @logic='and', @operator='in', @brackets= 0, @where=@where2 OUTPUT
		ELSE
			EXEC RunDynamicQueryBuilder1 @name='provider_type', @value=@provider_types, @type='c', @logic='and', @operator='in', @brackets= 0, @where=@where2 OUTPUT

		EXEC RunDynamicQueryBuilder1 @name='status_code', @value=@status_code, @type='c', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT
	END

	--print @where2
	EXEC RunSimpleDynamicQuery
        @source = @source,
		@columns = @columns,
        @filter = @filter,
        @where = @where,
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END
GO
