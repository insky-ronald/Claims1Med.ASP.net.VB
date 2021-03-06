USE [MEDICS52]
GO
/****** Object:  StoredProcedure [dbo].[SysGetReportTypes]    Script Date: 5/16/2018 4:48:35 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SysGetReportTypes] 
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017 upgraded for engine.v4
-- *************************************************************************************************** 
(
	@id as int = 0,
	@filter as varchar(100) = '',

	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @visit_id as bigint = 0,    
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'report_type',
	@order varchar(10) = 'asc'
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @action in (10,20,50)
	BEGIN		
		SELECT
			id,
			report_type,
			status_code_id
		FROM report_types WHERE id = @id

		RETURN
	END

    DECLARE @user_id AS int = 1 --dbo.F_VisitUserID(@visit_id)
	DECLARE @where2 nvarchar(100) = ''
    DECLARE @columns nvarchar(500) = 'id, report_type, status_code_id'


	SELECT
		@user_id = user_id
		--@application_id = application_id
	FROM visits
	WHERE id = @visit_id

	IF NOT EXISTS(SELECT * FROM sys_user_roles WHERE user_id = @user_id and role_id = 5)
		SET @where2 = 'status_code_id = 10'

    EXEC RunSimpleDynamicQuery
        @source = 'report_types',
        @columns = @columns,
        
        @filter = @filter,
        @where =  '[report_type] like @filter',
        @where2 = @where2,
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort
END
