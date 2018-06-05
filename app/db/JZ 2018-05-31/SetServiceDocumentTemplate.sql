USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[SetServiceDocumentTemplate] 
GO


CREATE PROCEDURE [dbo].[SetServiceDocumentTemplate] 
@id int = 0,
@document_type varchar(10) = '',
@visit_id AS bigint = 0,
@action_status_id AS int = 0 OUTPUT,
@action_msg AS varchar(200) = '' OUTPUT
AS
BEGIN
    SET NOCOUNT ON
	
    UPDATE services SET 
		document_type = @document_type
    WHERE id = @id

	/*
    IF @@rowcount = 0
    BEGIN
        SET @action_status_id = -10
        SET @action_msg = 'Cannot find contact to update.'
    END
	*/
END

GO


