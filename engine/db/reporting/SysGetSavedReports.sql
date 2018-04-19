DROP PROCEDURE [dbo].[SysGetSavedReports]
GO

CREATE PROCEDURE [dbo].[SysGetSavedReports]
/***************************************************************************************************
Last modified on
26-SEP-2017
 ***************************************************************************************************/
(
	@id as int = 0,
	@report_type_id as int = 0,
	@name as varchar(100) = '',

	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @visit_id as bigint = 0,    
	@sort varchar(200) = 'name', 
	@order varchar(10) = 'asc'
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_id AS int

	SELECT
		@user_id = user_id
	-- FROM visits
	FROM visits2 -- IHMS uses visits2
	WHERE id = @visit_id

	IF @action in (10,20,50)
	BEGIN		
		SELECT
			id,
			user_id,
			report_type_id,
			name
		FROM saved_reports WHERE id = @id

		RETURN
	END

	IF NOT EXISTS(SELECT * FROM saved_reports WHERE report_type_id = @report_type_id)
		EXEC SysAddSavedReportQuery
			@report_type_id = @report_type_id,
			@action = 20,
			@visit_id = @visit_id

	DECLARE @where2 nvarchar(100) = replace(replace('user_id = {0} AND report_type_id = {1}', '{0}', @user_id), '{1}', @report_type_id)

    EXEC RunSimpleDynamicQuery
        @source = 'saved_reports',
        @columns = 'id, user_id, report_type_id, name',

        @filter = @name,
        @where = '[name] like @filter',
        @where2 = @where2,

        @page = 1, 
    	@pagesize = 1000000,
        @sort = @sort,
		@order = @order
END
GO
