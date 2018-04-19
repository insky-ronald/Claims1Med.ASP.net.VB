DROP PROCEDURE [dbo].[SysRunReport] 
GO

CREATE PROCEDURE [dbo].[SysRunReport] 
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id int = 0, 
	@count_only bit = 0,
	@visit_id as bigint = 0,
	@page int = 1, 
	@pagesize int = 25, 
	@row_count int = 0 OUTPUT,
	@page_count int = 0 OUTPUT,
	@sort varchar(200) = '',
	@order varchar(10) = 'asc',
	@no_filter_no_result int = 1
)
AS
BEGIN
    SET NOCOUNT ON;
    
	DECLARE @where nvarchar(2000) = ''
	DECLARE @columns nvarchar(500) = 'id'
	DECLARE @parameters nvarchar(1000) = ''
	DECLARE @values nvarchar(1000) = ''

	DECLARE @source varchar(100) = ''
	DECLARE @final_source varchar(100) = ''
	DECLARE @source_join varchar(100) = ''
	DECLARE @totals varchar(500) = ''
	

	DECLARE @report_type_id int
	SELECT
		@report_type_id = t.id
	FROM saved_reports s
	JOIN report_types t on s.report_type_id = t.id
	WHERE s.id = @id

	DECLARE @exec_sql nvarchar(2048) = 'EXEC RunReport2_'+LTRIM(STR(@report_type_id))+'
		@id = @id,
		@source = @source OUTPUT,
		@final_source = @final_source OUTPUT,
		@source_join = @source_join OUTPUT,
		@totals = @totals OUTPUT,
		@where = @where OUTPUT,
		@columns = @columns OUTPUT,
		@parameters = @parameters OUTPUT,
		@values = @values OUTPUT,
		@page = @page OUTPUT, 
		@pagesize = @pagesize OUTPUT, 
		@sort = @sort OUTPUT,
		@order = @order OUTPUT
	'
	DECLARE @exec_params nvarchar(2048) = '
		@id int,
		@source varchar(100) OUTPUT,
		@final_source varchar(100) OUTPUT,
		@source_join varchar(100) OUTPUT,
		@totals varchar(500) OUTPUT,
		@where nvarchar(2000) OUTPUT,
		@columns nvarchar(500) OUTPUT,
		@parameters nvarchar(1000) OUTPUT,
		@values nvarchar(1000) OUTPUT,
		@page int OUTPUT, 
		@pagesize int OUTPUT, 
		@sort varchar(200) OUTPUT,
		@order varchar(10) OUTPUT
	'

	EXEC sp_executesql 
		@exec_sql, 
		@exec_params, 
		@id = @id,
		@source = @source OUTPUT,
		@final_source = @final_source OUTPUT,
		@source_join = @source_join OUTPUT,
		@totals = @totals OUTPUT,
		@where = @where OUTPUT,
		@columns = @columns OUTPUT,
		@parameters = @parameters OUTPUT,
		@values = @values OUTPUT,
		@page = @page OUTPUT, 
		@pagesize = @pagesize OUTPUT, 
		@sort = @sort OUTPUT,
		@order = @order OUTPUT

	EXEC SysRunDynamicQuery
		@source = @source,
		@total_source = @source,
		@final_source = @final_source,
		@source_join = @source_join,
		@columns = @columns,
		@parameter_names = @parameters,
		@parameter_values = @values,
		@where = @where,

		@page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
		@sort = @sort,
		@order = @order,
		@totals = @totals

END
GO
