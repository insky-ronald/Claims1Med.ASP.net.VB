DROP PROCEDURE [dbo].[GetMyTasks]
GO

CREATE PROCEDURE [dbo].[GetMyTasks]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	--@filter as varchar(100) = '',
	@id as int = 0,
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'claim_no',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;
   
	DECLARE @user_id int
	DECLARE @saved_report_id int = 0

	SELECT
		@user_id = user_id
	FROM visits WHERE id = @visit_id

	-- The report type for claims enquiry authorisation is 1004
	SELECT
		@saved_report_id = id
	FROM saved_reports
	WHERE report_type_id = 1005 AND user_id = @user_id and name = 'Normal'

	EXEC SysRunReport
		@id = @saved_report_id, 
		@visit_id = @visit_id,
		@page = @page,
		@pagesize = @pagesize,
		@row_count = @row_count OUTPUT,
		@page_count = @page_count OUTPUT,
		@sort = @sort,
		@order = @order,
		@no_filter_no_result = 1

/*
	DECLARE @user_id AS int = 0
    DECLARE @where nvarchar(500), @where2 nvarchar(500)

	SET @where = '[claim_no] like @filter'
   
	EXEC RunSimpleDynamicQuery
        @source = 'v_task_manager',
		@columns = '*',

        @filter = @filter,
        @where = @where,
		@where2 = @where2,
        
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order
*/
END
GO
