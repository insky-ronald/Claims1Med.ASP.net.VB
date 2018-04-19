DROP PROCEDURE [dbo].[SysAddReportType]
GO

CREATE PROCEDURE [dbo].[SysAddReportType]
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017 upgraded for engine.v4
-- *************************************************************************************************** 
(
    @id as int = 0,
    @report_type as varchar(100) = '' ,
    @status_code_id int = 10,

    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete;*/
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(200) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @user_id AS int = 1 --dbo.F_VisitUserID(@visit_id)
    DECLARE @user_name AS varchar(10) = '' --LEFT(dbo.F_VisitUserName(@visit_id), 10)

    SET @action_msg = ''
    SET @action_status_id = 0

    IF NOT @action IN (0, 10, 20)
        SET @action_status_id = -250 /* invalid request*/
  	
    IF @action_status_id < 0 GOTO DONE
    
    DECLARE @update_date [datetime] = GETDATE()    

    IF @action = 0 /* delete */
    BEGIN
		DELETE [dbo].report_types WHERE id = @id
    END

    IF @action = 10  /* update */
    BEGIN
		UPDATE dbo.report_types SET 
			id = @id,
			report_type = @report_type,
			status_code_id = @status_code_id,
			update_visit_id = @visit_id,
			updated_at = @update_date
		WHERE id = @id
    END
    
    /* insert */
    IF @action = 20 
    BEGIN
		INSERT INTO dbo.report_types (
			id,
			report_type,
			insert_visit_id,
			inserted_at,
			update_visit_id,
			updated_at,
			status_code_id
		) VALUES (
			@id,
			@report_type,
			@visit_id,
			@update_date,
			@visit_id,
			@update_date,
			@status_code_id
		);
    END    
DONE:
/*
    IF @action_status_id < 0
    BEGIN
        DECLARE @error_log_id AS int
        EXEC dbo.LogError @error_log_id OUTPUT, @action_status_id, '', 0, @visit_id 
        SET @action_msg = dbo.F_GetErrorLog(@error_log_id)
    END
    */
END
GO
