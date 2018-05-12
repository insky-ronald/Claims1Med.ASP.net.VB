USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[GetClaimsBatches] 
GO 

CREATE PROCEDURE [dbo].[GetClaimsBatches] 
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@filter as varchar(100) = '',
    @action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'batch_no',
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

	EXEC RunSimpleDynamicQuery
			@source = 'payment_batches',
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


