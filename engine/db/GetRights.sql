DROP PROCEDURE [dbo].[GetRights]
GO

CREATE PROCEDURE [dbo].[GetRights]  
-- ***************************************************************************************************
-- Last modified on
-- 07-MAR-2017
-- *************************************************************************************************** 
(
	@id as int = 0,
	@ids as varchar(200) = '',
    @filter as varchar(200) = '',
	@mode int = 0,
	@application_id int = 0,

    @page int = 1,
	@pagesize int = 25,
	@row_count int = 0 OUTPUT,
	@page_count int = 0 OUTPUT,
	@sort varchar(200) = 'position',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
    DECLARE @where nvarchar(500) = ''
    
	if @mode = 10
	begin

		select
		  id,
		  code,
		  rights,
		  description,
		  application_id,
		  position,
		  status_code_id
		  --insert_visit_id,
		  --inserted_at,
		  --update_visit_id,
		  --updated_at
		from v_rights
		where id = @id

	end else begin

		if LEN(@filter) > 0
    		set @where = '[rights] like @filter'
        
		if LEN(@ids) > 0
		begin
			if LEN(@where) > 0
    			set @where = @where + ' or [id] in (''' + replace(@ids, ',', ''',''') + ''')'
    		else
				set @where = ' [id] in (''' + replace(@ids, ',', ''',''') + ''')'
		end

		if LEN(@where) > 0
			set @where = '(' + @where + ') and [application_id] in (0,' + str(@application_id) + ')'
		else
			set @where = '[application_id] in (0,' + str(@application_id) + ')'       

		DECLARE @colums as varchar(200) = 'id,code,rights,description,position,status_code_id'

		if @mode = 50
		begin
			if LEN(@where) > 0
				set @where = '(' + @where + ') and [status_code_id] = 10'
			else
				set @where = '[status_code_id] = 10'

			set @colums = 'id,rights'
		end

    
		EXEC RunSimpleDynamicQuery
			@source = 'v_rights',
			@columns = @colums,
			@filter = @filter,
			@where = @where,
        
			@page = @page, 
    		@pagesize = @pagesize, 
    		@row_count = @row_count OUTPUT, 
    		@page_count = @page_count OUTPUT,
			@sort = @sort,
			@order = @order,
        
			@no_filter_no_result = 1

	end

END
