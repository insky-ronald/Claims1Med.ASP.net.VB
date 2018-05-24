USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[GetInvoiceStatuses]    Script Date: 5/22/2018 9:57:58 PM ******/
DROP PROCEDURE [dbo].[GetAllServiceTypes]
GO

CREATE PROCEDURE [dbo].[GetAllServiceTypes]
(
	@code char(4) = '',
	@codes as varchar(500) = '',
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
	DECLARE @columns varchar(100) = 'code, service_description'  
	DECLARE @where nvarchar(1000) = '[service_description] like @filter'
	DECLARE @where2 varchar(200) = ''
	DECLARE @where_logic varchar(10) = 'AND'

	IF @action in (10, 20, 50)
	BEGIN
		select 
			code,
			service_description
		from service_types
		where code = @code

		RETURN
	END

    IF LEN(@codes) > 0
	BEGIN
		SET @where_logic = 'OR'
		EXEC RunDynamicQueryBuilder1 @name='code', @value=@codes, @type='c', @operator='in', @where=@where2 OUTPUT
	END

	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'code, service_description'
		IF LEN(@filter) = 0 
			SET @filter = '%'
	END
    
	EXEC RunSimpleDynamicQuery
        @source = 'service_types',
		@columns = @columns,
		@filter = @filter,
		@where = @where,
		@where2 = @where2,
		@where_logic = @where_logic,        
		@page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
		@sort = @sort,
		@order = @order
END


GO


