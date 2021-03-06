DROP PROCEDURE [dbo].[GetRelationships]
GO

CREATE PROCEDURE [dbo].[GetRelationships]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@code char(3) = '',
	@filter as varchar(100) = '',
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'relationship',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @action in (10,20,50)
	BEGIN
		SELECT * FROM relationships WHERE code = @code
	END ELSE
	BEGIN
		DECLARE @user_id AS int = 0
		DECLARE @where2 nvarchar(500) = ''
		DECLARE @columns varchar(100) = 'code, relationship' 

		IF @action = 1
		BEGIN
			SET @where2 = 'code <> ''XX'''
			SET @pagesize = 1000000
		END

		IF LEN(@sort) = 0
			SET @sort = 'relationship'

		IF LEN(@order) = 0
			SET @order = 'asc'
			    
		EXEC RunSimpleDynamicQuery
			@source = 'relationships',
			@columns = @columns,
			@filter = @filter,
			@where = '[code] like @filter or [relationship] like @filter',
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
