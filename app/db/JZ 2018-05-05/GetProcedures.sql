DROP PROCEDURE [dbo].[GetProcedures]
GO

CREATE PROCEDURE [dbo].[GetProcedures]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(3) = NULL,
	@table_code varchar(10) = '',
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

	IF @action in (10,20,50)
	BEGIN
		SELECT * FROM cpt WHERE code = @code
	END ELSE
	BEGIN
		--DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
		DECLARE @user_id AS int = 0
		DECLARE @columns varchar(100) = '*'
		DECLARE @where2 varchar(200) = ''

		IF @action = 1
		BEGIN
			SET @pagesize = 1000000
			SET @columns = 'code,diagnosis'
		END

		IF LEN(@code) > 0
		   SET @where2 = '[code] = ' + QUOTENAME(@code, '''')

		SET @table_code = 'CPT'
		IF LEN(@table_code) > 0
		BEGIN
			IF LEN(@where2) > 0
				SET @where2 = @where2 + 'AND [table_code] = ' + QUOTENAME(@table_code, '''')
			ELSE
				SET @where2 = '[table_code] = ' + QUOTENAME(@table_code, '''')
		END
    
		EXEC RunSimpleDynamicQuery
			@source = 'cpt',
			@columns = @columns,

			@filter = @filter,
			@where = '[code] like @filter or [cpt] like @filter',
			@where2 = @where2,
			@page = @page, 
    		@pagesize = @pagesize, 
    		@row_count = @row_count OUTPUT, 
    		@page_count = @page_count OUTPUT,
			@sort = @sort,
			@order = @order
	END
END
GO
