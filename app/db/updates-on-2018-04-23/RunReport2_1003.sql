DROP PROCEDURE [dbo].[RunReport2_1003] 
GO

CREATE PROCEDURE [dbo].[RunReport2_1003] 
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id int = 0, 
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
	@order varchar(10) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

	SET @source = 'v_payment_batching'
	SET @source_join = ''
	SET @final_source = ''
	SET @totals = 'authorised,paid,paid_base,authorised_amount'
	SET @columns = '*'

	SELECT @sort = value FROM saved_report_items WHERE id = @id AND name = 'sort'
	SELECT @order = value FROM saved_report_items WHERE id = @id AND name = 'order'
	SELECT @page = value FROM saved_report_items WHERE id = @id AND name = 'page'
	SELECT @pagesize = value FROM saved_report_items WHERE id = @id AND name = 'pagesize'

	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='claim_no', @column_name='claim_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='service_no', @column_name='service_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='invoice_no', @column_name='invoice_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='invoice_entry_date_start', @column_name='create_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='invoice_entry_date_end', @column_name='create_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='>=', @name='service_creation_date_start', @column_name='invoice_input_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='d', @operator='<=', @name='service_creation_date_end', @column_name='invoice_input_date', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='=', @name='show_only_authorised', @column_name='sub_status_code', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
END

GO


