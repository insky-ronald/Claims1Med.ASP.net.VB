DROP PROCEDURE [dbo].[SysAddSavedReportQuery]  
GO

CREATE PROCEDURE [dbo].[SysAddSavedReportQuery]  
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id as int = 0 OUTPUT,
	@name as varchar(500) = 'Default',
	@report_type_id as int = 0,
	@query varchar(max) = '',
    @action as tinyint = 11, /* 20 = insert; 10 = update; 0 = delete; 11 = special case */
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(200) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @user_id AS int

	SELECT
		@user_id = user_id
	-- FROM visits
	FROM visits2 -- IHMS uses visits2
	WHERE id = @visit_id

	IF @action = 11
		UPDATE saved_reports SET 
			query = @query, 
			update_visit_id = @visit_id, 
			updated_at = getdate() 
		WHERE id = @id
	ELSE IF @action = 10
		UPDATE saved_reports SET 
			name = @name,
			update_visit_id = @visit_id, 
			updated_at = getdate() 
		WHERE id = @id
	ELSE IF @action = 20 
	BEGIN
		INSERT INTO saved_reports (
			name,
			user_id,
			report_type_id,
			query,
			insert_visit_id,
			inserted_at
		) VALUES (
			@name,
			@user_id,
			@report_type_id,
			@query,
			@visit_id, 
			getdate()
		)

		SET @id = CAST(SCOPE_IDENTITY() as int);
	END
	ELSE IF @action = 0 
	BEGIN
		DELETE saved_reports WHERE id = @id
		DELETE saved_report_items WHERE id = @id
	END
END
GO
