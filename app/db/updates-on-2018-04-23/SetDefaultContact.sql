DROP PROCEDURE [dbo].[SetDefaultContact] 
GO

CREATE PROCEDURE [dbo].[SetDefaultContact] 
@name_id int = 0,
@contact_id int = 0,
@visit_id AS bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
@action_status_id AS int = 0 OUTPUT,
@action_msg AS varchar(200) = '' OUTPUT
AS
BEGIN
    SET NOCOUNT ON

    UPDATE names SET 
		contact_id = @contact_id
    WHERE id = @name_id

    IF @@rowcount = 0
    BEGIN
        SET @action_status_id = -10
        SET @action_msg = 'Cannot find contact to update.'
    END
END
GO
