USE [MEDICS50]
GO

/****** Object:  StoredProcedure [dbo].[GetProviders]    Script Date: 6/27/2017 3:05:02 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[GetProviders]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@p_type char(3) = NULL,
	@lookup int = 0,
	@filter as varchar(100) = '',

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
	DECLARE @where nvarchar(500), @where2 nvarchar(500)
	DECLARE @columns varchar(100) = '*'  
	IF @lookup > 0  
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'name,country'
	END

	SET @where = '[name] like @filter or [country] like @filter'
	SET @where2 = '[provider_type] = ' + ''''+@p_type+''''
    
	EXEC RunSimpleDynamicQuery
        @source = 'providers',
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


