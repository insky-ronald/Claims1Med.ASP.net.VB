USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[GetAddressTypes]    Script Date: 5/1/2018 3:02:02 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






ALTER PROCEDURE [dbo].[GetAddressTypes]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(3) = NULL,
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
		SELECT code, address_type FROM address_types WHERE code = @code
	END ELSE
	BEGIN
		--DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
		DECLARE @user_id AS int = 0
		DECLARE @columns varchar(100) = 'code, address_type' 

		IF @action = 1
		BEGIN
			SET @pagesize = 1000000
		END
    
	EXEC RunSimpleDynamicQuery
        @source = 'address_types',
		@columns = @columns,

        @filter = @filter,
        @where = '[code] like @filter or [address_type] like @filter',

        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order
	END
END







GO


