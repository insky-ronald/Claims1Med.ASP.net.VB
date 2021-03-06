USE [MEDICS52]
GO

ALTER PROCEDURE [dbo].[RunReport2_2001] 
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id int = 0, 
	@action int = 0, -- 0:normal, 10:export
	@source varchar(100) = '' OUTPUT,
	@total_source varchar(100) = '' OUTPUT,
	@final_source varchar(100) = '' OUTPUT,
	@source_join varchar(100) = '' OUTPUT,
	@totals varchar(500) = '' OUTPUT,
	
	@where nvarchar(2000) = '' OUTPUT,
	@columns nvarchar(500) = 'id' OUTPUT,
	@parameters nvarchar(1000) = '' OUTPUT,
	@values nvarchar(1000) = '' OUTPUT,

	@page int = 1 OUTPUT, 
	@pagesize int = 25 OUTPUT, 
	@sort varchar(200) = '' OUTPUT,
	@order varchar(10) = '' OUTPUT,
	@visit_id bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	SET @source = 'v_report_2001'
	SET @source_join = ''
	SET @final_source = ''
	SET @totals = ''
	SET @columns = '*'

	SELECT @sort = value FROM saved_report_items WHERE id = @id AND name = 'sort'
	SELECT @order = value FROM saved_report_items WHERE id = @id AND name = 'order'
	SELECT @page = value FROM saved_report_items WHERE id = @id AND name = 'page'
	IF @action = 0
		SELECT @pagesize = value FROM saved_report_items WHERE id = @id AND name = 'pagesize'
	ELSE
		SET @pagesize = 1000000

	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT

	DECLARE @show_members_option varchar(100)
	SELECT @show_members_option = value FROM saved_report_items WHERE id = @id AND name = 'show_members_option'

	IF @@rowcount > 0
	BEGIN
		IF @show_members_option = 'A'
			EXEC RunDynamicQueryBuilder2 @id=@id, @static_value = 'C', @type='c', @operator='<>', @name='show_members_option', @column_name='history_type', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
		ELSE IF @show_members_option = 'X'
			EXEC RunDynamicQueryBuilder2 @id=@id, @static_value = 'C', @type='c', @operator='=', @name='show_members_option', @column_name='history_type', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	END
END

GO
