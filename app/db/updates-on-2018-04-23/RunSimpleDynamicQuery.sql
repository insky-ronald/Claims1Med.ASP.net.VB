ALTER PROCEDURE [dbo].[RunSimpleDynamicQuery] 
(
    @source nvarchar(100) = '',
    @columns  nvarchar(500) = '*',
    @filter nvarchar(100) = '',
    @where nvarchar(500) = '',
    @where2 nvarchar(500) = '',
    @where_logic varchar(10) = 'AND', -- added on 18-SEP-2017
    @page int = 1, 
	@pagesize int = 25, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT,
    @sort varchar(200) = '',
    @order varchar(10) = 'asc',
    @totals varchar(200) = '',
    
    @no_filter_no_result bit = 0
)
AS
BEGIN
    SET NOCOUNT ON;
    
	DECLARE @sql nvarchar(MAX)
	DECLARE @sql_count nvarchar(MAX)
	DECLARE @sql_total nvarchar(MAX)
    DECLARE @params nvarchar(max) = '
        @start int,
        @end int,
        @filter varchar(100)
    '
    DECLARE @params_count nvarchar(max) = '
        @row_count int OUTPUT,
        @filter varchar(100)
    '
    DECLARE @params_total nvarchar(max) = '
        @filter varchar(100)
    '
    
    SET @sql_count = '
        SELECT 
            @row_count = COUNT(*)
        FROM ' + @source
    
    IF LEN(@totals) > 0
    BEGIN
		declare @total_expression nvarchar(200)

		select  
			@total_expression = COALESCE(@total_expression + ', ' ,'') + value +'=SUM('+ value +')'
		from F_Split(@totals, ',')


		SET @sql_total = '
			SELECT 
				row_count = COUNT(*), ' +@total_expression+ '
			FROM ' + @source
	END
	    
    SET @sql = '
		SELECT * FROM (
            SELECT ROW_NUMBER() OVER (ORDER BY [' + @sort + ']' + @order +') AS row_no,
        		' + @columns + '
        	FROM ' + @source
    
/****************************************************************************************************
    Construct where clause
****************************************************************************************************/
	if LEN(@filter) = 0 and @no_filter_no_result = 1
    begin
    	set @filter = ''
    end else
        IF LEN(@filter) > 0
        BEGIN
			SET @filter = '%' + @filter + '%'			
        END ELSE
            SET @where = ''
        
        IF LEN(@where2) > 0
        BEGIN
            IF LEN(@where) > 0
                SET @where = '(' + @where + ') '+@where_logic+' (' + @where2 + ')'
            ELSE
                SET @where = @where2
        END
    
    IF LEN(@where) > 0
    BEGIN
        SET @sql = @sql + ' WHERE ' + @where
        SET @sql_count = @sql_count + ' WHERE ' + @where
        SET @sql_total = @sql_total + ' WHERE ' + @where
    END
    
/****************************************************************************************************
    Execute query
****************************************************************************************************/
	--print @sql
    EXEC sp_executesql @sql_count, @params_count, @row_count OUTPUT, @filter

    IF @pagesize = 0 SET @pagesize = 25
    
    SET @page_count = @row_count / @pagesize
    IF @row_count % @pagesize > 0
        SET @page_count = @page_count + 1
        
    SET @page = ISNULL(@page, 1)
    IF @page > @page_count SET @page = 1

    DECLARE @start int
    DECLARE @end int
    SET @start = (@page-1) * @pagesize
    SET @end = (@page-1) * @pagesize + @pagesize

    SET @sql = @sql + ' ) AS result WHERE row_no > @start and row_no <= @end'
    
    EXEC sp_executesql @sql, @params, @start, @end, @filter
    --print @sql
    IF LEN(@totals) > 0
    BEGIN
    	--SET @sql_total = @sql_count
    	EXEC sp_executesql @sql_total, @params_total, @filter
    END
END
