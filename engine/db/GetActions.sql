DROP PROCEDURE [dbo].[GetActions]
GO

CREATE PROCEDURE [dbo].[GetActions]  (
-- ***************************************************************************************************
-- Last modified on
-- 08-MAR-2017
-- *************************************************************************************************** 
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
			action_name,
			description,
			action_type_id,
			application_id,
			position,
			status_code_id,
			dbo.f_action_rights(id) as rights
		from v_actions
		where id = @id

	end else begin

		if LEN(@filter) > 0
    		set @where = '[action_name] like @filter'
        
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
       
		DECLARE @colums as varchar(200) = 'id,code,action_name,description,action_type_id,position,status_code_id, dbo.f_action_rights_names(id) as rights'
    
		EXEC RunSimpleDynamicQuery
			@source = 'v_actions',
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

GO


