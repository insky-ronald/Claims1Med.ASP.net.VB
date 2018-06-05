USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[RunReport2_2003]
GO

CREATE PROCEDURE [dbo].[RunReport2_2003] 
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

	--SET @source = 'v_report_2003'
	--SET @total_source = 'v_report_raw_2003'
	SET @source = 'v_report_raw_2003'
	SET @total_source = ''
	SET @source_join = 'id'
	SET @final_source = 'v_report_2003'
	SET @totals = ''
	SET @columns = '*'

	SELECT @sort = value FROM saved_report_items WHERE id = @id AND name = 'sort'
	SELECT @order = value FROM saved_report_items WHERE id = @id AND name = 'order'
	SELECT @page = value FROM saved_report_items WHERE id = @id AND name = 'page'
	IF @action = 0
		SELECT @pagesize = value FROM saved_report_items WHERE id = @id AND name = 'pagesize'
	ELSE
		SET @pagesize = 1000000
	
	--Client
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Claim
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='claim_no', @column_name='claim_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='service_no', @column_name='service_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='status_codes', @column_name='status', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='=', @name='status', @column_name='status', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='claim_sub_types', @column_name='claim_sub_type', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='=', @name='claim_sub_type', @column_name='claim_sub_type', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Treatment Date
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='treatment_date_start', @column_name='treatment_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='treatment_date_end', @column_name='treatment_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Policy
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='policy_nos', @column_name='policy_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='policy_name', @column_name='policy_name', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Providers
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='provider_ids', @column_name='provider_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='physician_ids', @column_name='physician_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
END


GO


