USE [MEDICS52SYS]
GO
/****** Object:  StoredProcedure [dbo].[GetActions]    Script Date: 5/16/2018 12:03:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetActions]  (
-- ***************************************************************************************************
-- Last modified on
-- 08-MAR-2017
-- *************************************************************************************************** 
	@id as int = 0,
	@ids as varchar(200) = '',
    @filter as varchar(200) = '',
	@application_id int = 0,

	@mode int = 0, /* */
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
			dbo.f_action_rights(id) as rights,
			application_id
		from v_actions
		where id = @id

		RETURN

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
	
		if @mode = 11
		begin
			if LEN(@where) > 0
				set @where = '(' + @where + ') and [application_id] = ' + str(@application_id)
			else
				set @where = '[application_id] =' + str(@application_id)
		end else begin
			if LEN(@where) > 0
				set @where = '(' + @where + ') and [application_id] in (0,' + str(@application_id) + ')'
			else
				set @where = '[application_id] in (0,' + str(@application_id) + ')'
		end
		       
		DECLARE @columns as varchar(200) = 'id,parent_id,position,code,action_name,description,action_type_id,status_code_id, dbo.f_action_rights_names(id) as rights, application_id'
		DECLARE @actions TABLE (
			row_no int,
			id int,
			parent_id int,
			position int ,
			code varchar(20) ,
			action_name varchar(100) ,
			description varchar(200) ,
			action_type_id int ,
			status_code_id int,
			rights varchar(512) ,
			application_id int
		)

		INSERT INTO @actions (
			id,
			parent_id,
			position,
			action_name
		) VALUES (
			1,
			0,
			1,
			'System'
		)

		INSERT INTO @actions (
			id,
			parent_id,
			position,
			action_name
		) VALUES (
			2,
			0,
			2,
			'Application'
		)

		INSERT INTO @actions
			EXEC RunSimpleDynamicQuery
				@source = 'v_actions',
				@columns = @columns,
				@filter = @filter,
				@where = @where,
				@page = @page, 
    			--@pagesize = @pagesize, 
				@pagesize = 1000000, 
    			@row_count = @row_count OUTPUT, 
    			@page_count = @page_count OUTPUT,
				@sort = @sort,
				@order = @order,
				@no_filter_no_result = 1

		;WITH cte AS (
			SELECT
				id,
				cast(row_number() over(partition by parent_id order by position) as varchar(max)) as [path]
			FROM @actions
			WHERE parent_id = 0
			UNION ALL
			SELECT
				t.id,
				[path] + cast(row_number()over(partition by t.parent_id order by t.position) as varchar(max))
			FROM cte
			JOIN @actions t ON cte.id = t.parent_id
		) 
		SELECT 
			t.path,
			s.id,
			s.parent_id,
			s.position,
			s.code,
			s.action_name,
			s.description,
			s.action_type_id,
			s.status_code_id,
			s.rights,
			s.application_id
		FROM cte t
		JOIN @actions s on t.id = s.id
		ORDER by t.path 

	/*
		SELECT 
			id,
			parent_id,
			position,
			code,
			action_name,
			description,
			action_type_id,
			status_code_id,
			rights
		FROM @actions
		*/
	end 

END

