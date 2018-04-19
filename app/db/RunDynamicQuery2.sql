DROP PROCEDURE [dbo].[RunDynamicQuery2]
GO

CREATE PROCEDURE [dbo].[RunDynamicQuery2]
(
    @source varchar(100) = '',
	@total_source varchar(100) = '',
	@final_source varchar(100) = '',
    @columns  varchar(500) = '*',
	@source_join varchar(100),
    @where nvarchar(2000) = '',
	@parameter_names varchar(1000) = '',
    @parameter_values nvarchar(1000) = '',

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
        @end int
    '
    DECLARE @params_count nvarchar(max) = '
        @row_count int OUTPUT
    '
    DECLARE @params_total nvarchar(max) = '
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
			FROM ' + @total_source
	END
	    
    SET @sql = '
		SELECT * FROM (
            SELECT ROW_NUMBER() OVER (ORDER BY [' + @sort + ']' + @order +') AS row_no,
        		' + @columns + '
        	FROM ' + @source
    
/****************************************************************************************************
    Construct where clause
****************************************************************************************************/
    IF LEN(@where) > 0
    BEGIN
        SET @sql = @sql + ' WHERE ' + @where
        SET @sql_count = @sql_count + ' WHERE ' + @where
        SET @sql_total = @sql_total + ' WHERE ' + @where
    END
    
/****************************************************************************************************
    Execute query
****************************************************************************************************/
	
	DECLARE @sql2 nvarchar(MAX) = 'sp_executesql @sql, @params, @row_count = @row_count OUTPUT'
    DECLARE @params2 nvarchar(max) = '@sql nvarchar(max), @params nvarchar(max), @row_count int OUTPUT'

	IF LEN(@parameter_values) > 0 SET @sql2 = @sql2 +', '+ @parameter_values
	IF LEN(@parameter_names) > 0 SET @params_count = @params_count +', '+ @parameter_names

	EXEC sp_executesql @sql2, @params2, @sql=@sql_count, @params=@params_count, @row_count=@row_count OUTPUT

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
    
	SET @sql2 = 'sp_executesql @sql, @params, @start, @end'
    SET @params2 = '@sql nvarchar(max), @params nvarchar(max), @start int, @end int'

	IF LEN(@parameter_values) > 0 SET @sql2 = @sql2 +', '+ @parameter_values
	IF LEN(@parameter_names) > 0 SET @params = @params +', '+ @parameter_names


		--print @final_source
	IF LEN(@final_source) = 0
	BEGIN
		EXEC sp_executesql @sql2, @params2, @sql=@sql, @params=@params, @start=@start, @end=@end
		--RETURN
	END ELSE BEGIN
		DECLARE @temp as reporting_temporary_table

		INSERT INTO @temp
			EXEC sp_executesql @sql2, @params2, @sql=@sql, @params=@params, @start=@start, @end=@end

		DECLARE @sql3 nvarchar(1028) = '
			SELECT 
				r.*
			FROM @temp t
			JOIN '+@final_source+' r ON t.id = r.'+@source_join+'
			ORDER BY t.row_no
		'

		EXEC sp_executesql @sql3, N'@temp reporting_temporary_table READONLY', @temp
	END

    IF LEN(@totals) > 0
    BEGIN
		SET @sql2 = 'sp_executesql @sql, @params'
		SET @params2 = '@sql nvarchar(max), @params nvarchar(max)'

		IF LEN(@parameter_values) > 0 SET @sql2 = @sql2 +', '+ @parameter_values
		IF LEN(@parameter_names) > 0 SET @params_total = @parameter_names

		EXEC sp_executesql @sql2, @params2, @sql=@sql_total, @params=@params_total
    END
	
END
GO
