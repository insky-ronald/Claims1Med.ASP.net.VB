USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[RunReport2_2004]    Script Date: 5/31/2018 6:39:55 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[RunReport2_2004] 
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

	SET @source = 'v_report_2004'
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
	
	--Client
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Claim
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='claim_no', @column_name='claim_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='service_no', @column_name='service_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='service_id', @column_name='service_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='status_codes', @column_name='status', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='claim_types', @column_name='claim_type', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Policy
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='policy_nos', @column_name='policy_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Providers
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='provider_ids', @column_name='provider_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='physician_ids', @column_name='physician_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Case Opened
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='case_opened_start', @column_name='case_opened', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='case_opened_end', @column_name='case_opened', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	--Incident Date
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='incident_date_start', @column_name='incident_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='incident_date_end', @column_name='incident_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
END



GO


