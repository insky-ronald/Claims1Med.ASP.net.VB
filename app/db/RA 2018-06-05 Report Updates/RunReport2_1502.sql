USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[RunReport2_1502]    Script Date: 6/19/2018 12:31:45 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RunReport2_1502] 
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

	SET @source = 'v_report_raw_1502'
	SET @total_source = ''
	SET @source_join = 'id'
	SET @final_source = 'v_report_1502'
	SET @totals = ''
	SET @columns = '*'

	SELECT @sort = value FROM saved_report_items WHERE id = @id AND name = 'sort'
	SELECT @order = value FROM saved_report_items WHERE id = @id AND name = 'order'
	SELECT @page = value FROM saved_report_items WHERE id = @id AND name = 'page'
	IF @action = 0
		SELECT @pagesize = value FROM saved_report_items WHERE id = @id AND name = 'pagesize'
	ELSE
		SET @pagesize = 1000000

	--User
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='user_names', @column_name='user_name', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Client
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Dates
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='=', @name='status_date', @column_name='status_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='=', @name='incident_date', @column_name='incident_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='=', @name='notification_date', @column_name='notification_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
END




GO


