DROP PROCEDURE [dbo].[RunReport2_1001]
GO

CREATE PROCEDURE [dbo].[RunReport2_1001] 
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

	SET @source = 'v_members_enquiry'
	SET @source_join = ''
	SET @final_source = ''
	SET @totals = ''
	SET @columns = '*'

	SELECT @sort = value FROM saved_report_items WHERE id = @id AND name = 'sort'
	SELECT @order = value FROM saved_report_items WHERE id = @id AND name = 'order'
	SELECT @page = value FROM saved_report_items WHERE id = @id AND name = 'page'
	SELECT @pagesize = value FROM saved_report_items WHERE id = @id AND name = 'pagesize'

	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='name', @column_name='full_name', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='like%', @name='certificate_no', @column_name='certificate_no', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	/*

	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='client_ids', @column_name='client_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='policy_ids', @column_name='policy_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='in', @name='broker_ids', @column_name='broker_id', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='settlement_currency_codes', @column_name='settlement_currency_code', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='client_currency_codes', @column_name='client_currency_code', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='c', @operator='in', @name='user_names', @column_name='status_user', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='=', @name='show_referral', @column_name='is_referral', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='=', @name='show_only_selected', @column_name='is_selected', @if_value_not='0', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	EXEC RunDynamicQueryBuilder2 @id=@id, @type='n', @operator='=', @name='show_blocked', @column_name='is_blocked', @if_value_not='10', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
	
	IF LEN(@where) = 0
		SET @where = 'id = 0'
	*/
END
GO
