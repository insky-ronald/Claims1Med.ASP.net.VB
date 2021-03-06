USE [MEDICS52SYS]
GO
/****** Object:  StoredProcedure [dbo].[GetUsers]    Script Date: 5/15/2018 10:54:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetUsers]
-- ***************************************************************************************************
-- Last modIFied on
-- 
-- *************************************************************************************************** 
(
	@id as int = 0,
	@ids as varchar(200) = '',
    @filter as varchar(200) = '',
	@mode int = 0,

    @page int = 1,
	@pagesize int = 25,
	@row_count int = 0 OUTPUT,
	@page_count int = 0 OUTPUT,
	@sort varchar(200) = 'user_name',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id AS int
	DECLARE @application_id AS int
    DECLARE @where nvarchar(500) = ''

	SELECT
		@user_id = user_id,
		@application_id = application_id
	FROM visits
	WHERE id = @visit_id
    
	IF @mode = 10
	BEGIN
		SELECT
			*,
			dbo.f_user_roles(id) as roles
		FROM v_users 
		WHERE id = @id
	END ELSE BEGIN
		IF LEN(@filter) > 0
    		SET @where = '[user_name] like @filter or [full_name] like @filter or [designation] like @filter'
        
		IF LEN(@ids) > 0
		BEGIN
			IF LEN(@where) > 0
    			SET @where = @where + ' or [id] in (''' + replace(@ids, ',', ''',''') + ''')'
    		ELSE
				SET @where = ' [id] in (''' + replace(@ids, ',', ''',''') + ''')'
		END
       
		IF LEN(@where) > 0
    		SET @where = '(' + @where + ') AND [id] in (SELECT user_id FROM application_users WHERE application_id in (0,'+STR(@application_id)+'))'
    	ELSE
			SET @where = '[id] in (SELECT user_id FROM application_users WHERE application_id in (0,'+STR(@application_id)+'))'

		DECLARE @colums as varchar(200) = 'id,user_name,full_name,designation,status_code_id, dbo.f_user_role_names(id) as role_names'
		print @where
		EXEC RunSimpleDynamicQuery
			@source = 'v_users',
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
	END

END
