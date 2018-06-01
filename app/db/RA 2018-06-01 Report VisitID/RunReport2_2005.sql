USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[RunReport2_2005]    Script Date: 5/31/2018 6:39:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RunReport2_2005] 
(
	@id int = 0, 
	@action int = 0, -- 0:normal, 10:export
	@source varchar(100) = '' OUTPUT,
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

	SET @source = 'v_report_2005'
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
	
	--Customer Service
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='reference_no', @column_name='reference_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='service_types', @column_name='service_type', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Status
	--EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='=', @name='status', @column_name='status', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='sub_status_codes', @column_name='status_code', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Call Date
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='call_date_start', @column_name='call_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='call_date_end', @column_name='call_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Note
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='=', @name='note_category', @column_name='note_category', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='=', @name='note_sub_category', @column_name='note_sub_category', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Creation Date
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='note_insert_date_start', @column_name='note_insert_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='note_insert_date_end', @column_name='note_insert_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Client
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Member
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='member_name', @column_name='member_name', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
END




GO


