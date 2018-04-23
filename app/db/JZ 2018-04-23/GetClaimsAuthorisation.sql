DROP PROCEDURE [dbo].[GetClaimsAuthorisation]
GO

CREATE PROCEDURE [dbo].[GetClaimsAuthorisation]
-- ***************************************************************************************************
-- Last modified on
-- 23-APR-2018
-- *************************************************************************************************** 
(
	@id as bigint = 0,    
    @visit_id as bigint = 0,	
    @page int = 1,
	@pagesize int = 25,
	@row_count int = 0 OUTPUT,
	@page_count int = 0 OUTPUT,
	@sort varchar(200) = '',
	@order varchar(10) = 'asc'
)
AS
BEGIN
    SET NOCOUNT ON;
   
	DECLARE @user_id int
	DECLARE @saved_report_id int = 0

	SELECT
		@user_id = user_id
	FROM visits WHERE id = @visit_id

	-- The report type for Payment Authorisation is 1002
	SELECT
		@saved_report_id = id
	FROM saved_reports
	WHERE report_type_id = 1002 AND user_id = @user_id and name = 'Normal'

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
END
GO

