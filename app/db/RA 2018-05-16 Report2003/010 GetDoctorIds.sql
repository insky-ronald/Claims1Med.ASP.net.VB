USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[GetDoctorIds]
GO


CREATE PROCEDURE [dbo].[GetDoctorIds]
(
	@id as int = 0,
	@ids as varchar(200) = '',
	@filter as varchar(100) = '',
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
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
	DECLARE @columns varchar(100) = 'id, code, name, specialisation, country'  
	DECLARE @where nvarchar(1000) = '[name] like @filter'
	DECLARE @where2 varchar(200) = ''
	DECLARE @where_logic varchar(10) = 'AND'

	IF @action in (10, 20, 50)
	BEGIN
		SELECT
			*
		FROM v_providers
		WHERE id = @id

		RETURN
	END

    IF LEN(@ids) > 0
	BEGIN
		SET @where_logic = 'OR'
		EXEC RunDynamicQueryBuilder1 @name='id', @value=@ids, @type='n', @operator='in', @where=@where2 OUTPUT
	END

	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'id, code, name, specialisation, country'  
		IF LEN(@filter) = 0 
			SET @filter = '%'
	END
    
	EXEC RunSimpleDynamicQuery
        @source = 'v_doctors',
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


