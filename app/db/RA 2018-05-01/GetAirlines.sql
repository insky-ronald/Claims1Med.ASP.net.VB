USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[GetPharmacies]    Script Date: 5/1/2018 4:46:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO








CREATE PROCEDURE [dbo].[GetAirlines]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
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

    IF @action in (10,20,50)
	BEGIN
		SELECT * FROM v_airlines WHERE id = @id
	END ELSE
	BEGIN
		DECLARE @user_id AS int = 0
		DECLARE @where nvarchar(500), @where2 nvarchar(500)
		DECLARE @columns varchar(100) = '*' 

		SET @where = '[name] like @filter'
    
		EXEC RunSimpleDynamicQuery
			@source = 'v_airlines',
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

END









GO


