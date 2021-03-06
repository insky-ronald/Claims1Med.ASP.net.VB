DROP PROCEDURE [dbo].[GetDoctors]
GO

CREATE PROCEDURE [dbo].[GetDoctors]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@lookup int = 0,
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
	DECLARE @user_id AS int = 0
	DECLARE @where nvarchar(500), @where2 nvarchar(500)
	DECLARE @columns varchar(100) = '*' 

	IF @lookup > 0  
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'name, country'
	END

	SET @where = '[name] like @filter or [specialisation] like @filter or [country] like @filter'

	IF @id > 0 
	   SET @where2 = '[provider_type] = ''D'' and [id] = ' + CAST(@id as varchar)
	ELSE IF (@id = 0 and @pagesize in (25, 50, 75, 100))
		SET @where2 = '[provider_type] = ''D'''	
	ELSE IF (@id = 0 and @lookup = 0) 
	   SET @where2 = '[provider_type] = ''D'' and [id] = -1'
	ELSE IF (@id = 0 and @lookup > 0) 
	   SET @where2 = '[provider_type] = ''D'''
    
	EXEC RunSimpleDynamicQuery
        @source = 'providers',
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
