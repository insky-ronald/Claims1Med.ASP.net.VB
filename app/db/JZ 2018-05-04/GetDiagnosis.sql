DROP PROCEDURE [dbo].[GetDiagnosis]
GO

CREATE PROCEDURE [dbo].[GetDiagnosis]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(3) = NULL,
	@version char(2) = '',
	@is_shortlist tinyint = 0,
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
		SELECT * FROM icd WHERE code = @code
	END ELSE
	BEGIN
		--DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
		DECLARE @user_id AS int = 0
		DECLARE @columns varchar(100) = 'version,code,diagnosis,is_shortlist'
		DECLARE @where2 varchar(200) = ''

		IF @action = 1
		BEGIN
			SET @pagesize = 1000000
			SET @columns = 'code,diagnosis'
		END

		IF LEN(@code) > 0
		   SET @where2 = '[code] = ' + QUOTENAME(@code, '''')

		IF LEN(@version) > 0
		BEGIN
			IF LEN(@where2) > 0
				SET @where2 = @where2 + 'AND [version] = ' + QUOTENAME(@version, '''')
			ELSE
				SET @where2 = '[version] = ' + QUOTENAME(@version, '''')
		END

		IF @is_shortlist > 0
		BEGIN
			IF LEN(@where2) > 0
				SET @where2 = @where2 + 'AND [is_shortlist] = 1'
			ELSE
				SET @where2 = '[is_shortlist] = 1'
		END
    
		EXEC RunSimpleDynamicQuery
			@source = 'icd',
			@columns = @columns,

			@filter = @filter,
			@where = '[code] like @filter or [diagnosis] like @filter',
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

