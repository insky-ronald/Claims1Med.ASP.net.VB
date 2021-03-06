ALTER PROCEDURE [dbo].[GetServiceStatusCodes]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@service_type char(3) = '',
	@status_code char(1) = '',
	@code varchar(7) = '',
	@filter as varchar(100) = '',
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'sub_status_code',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @action in (10,20,50)
	BEGIN
		SELECT * FROM v_service_status_codes WHERE service_type = @service_type AND code = @code
	END ELSE
	BEGIN
		DECLARE @user_id AS int = 0
		DECLARE @columns varchar(100) = '*'
		DECLARE @where2 nvarchar(200) = 'service_type = ''' + @service_type + ''''

		IF LEN(@status_code) > 0
			SET @where2 = @where2 + ' AND status_code = ' + QUOTENAME(@status_code, '''')

		IF @action = 1
		BEGIN
			IF LEN(@status_code) > 0
				SET @columns = 'status_code, main_status, sub_status_code, sub_status'
			SET @pagesize = 1000000
		END
    
		EXEC RunSimpleDynamicQuery
			@source = 'v_service_status_codes',
			@columns = @columns,

			@filter = @filter,
			@where = '[sub_status] like @filter or [sub_status_code] like @filter',
			@where2 = @where2,
			@page = @page, 
    		@pagesize = @pagesize, 
    		@row_count = @row_count OUTPUT, 
    		@page_count = @page_count OUTPUT,
			@sort = @sort,
			@order = @order
	END
END














