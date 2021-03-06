USE [MEDICS52]
GO

ALTER PROCEDURE [dbo].[RunReport2_1005] 
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
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

	SET @source = 'v_task_manager'
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
	
	DECLARE @this_user_name varchar(10) = ''
	
	SELECT
		@this_user_name = user_name
	FROM visits WHERE id = @visit_id
	

	-- for testing hard-code action owner
	EXEC RunDynamicQueryBuilder2 @id=@id, @static_value = @this_user_name, @type='c', @operator='=', @name='', @column_name='action_owner', @where = @where OUTPUT, @parameters = @parameters OUTPUT, @values = @values OUTPUT
END
GO

