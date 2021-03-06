USE [MEDICS52]
GO
/****** Object:  StoredProcedure [dbo].[GetClients]    Script Date: 4/23/2018 8:33:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetClients]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@ids as varchar(200) = '',
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

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
	DECLARE @columns varchar(100) = '*'  
	DECLARE @where2 varchar(200) = ''

	IF @action in (10, 20, 50)
	BEGIN
		SELECT
			*
		FROM v_clients
		WHERE id = @id

		RETURN
	END

	IF @action = 1
	BEGIN
		SET @pagesize = 1000000
		SET @columns = 'account_code, name, client_currency_code'
	END

	IF @id > 0
	   SET @where2 = '[id] = ' + cast(@id as varchar)
    
	EXEC RunSimpleDynamicQuery
        @source = 'v_clients',
		@columns = @columns,

        @filter = @filter,
        @where = '[name] like @filter',
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END
