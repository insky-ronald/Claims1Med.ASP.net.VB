DROP PROCEDURE [dbo].[GetNoteSubTypes]
GO

/****** Object:  StoredProcedure [dbo].[GetNoteSubTypes]    Script Date: 8/15/2017 10:48:45 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetNoteSubTypes]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@note_type char(3) = NULL,
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
		SELECT note_type, code, note_sub_type FROM note_sub_types WHERE note_type = @note_type AND code = @code
	END ELSE
	BEGIN
		--DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
		DECLARE @user_id AS int = 0
		DECLARE @columns varchar(100) = 'note_type,code,note_sub_type'  
		DECLARE @where2 nvarchar(200) = 'note_type = ''' + @note_type + ''''

		IF @action = 1
		BEGIN
			SET @pagesize = 1000000
			--SET @columns = 'note_type,code,note_sub_type'
		END

		EXEC RunSimpleDynamicQuery
			@source = 'note_sub_types',
			@columns = @columns,

			@filter = @filter,
			@where = '[code] like @filter or [note_sub_type] like @filter',
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

