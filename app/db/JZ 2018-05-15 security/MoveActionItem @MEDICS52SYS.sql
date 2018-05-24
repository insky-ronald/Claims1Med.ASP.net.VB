USE [MEDICS52SYS]
GO

DROP PROCEDURE [dbo].[MoveActionItem]
GO

CREATE PROCEDURE [dbo].[MoveActionItem]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@target_id int = 0,
	@action int = 0, --0:move, 1:re-position
    @visit_id as bigint = 0,
	@action_status_id as int = 0 OUTPUT,
	@action_msg as varchar(200) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @position int
	DECLARE @parent_id int
	DECLARE @application_id int
	DECLARE @old_parent_id int
	DECLARE @old_position int
	DECLARE @new_parent_id int
	DECLARE @new_position int

	--IF @parent_id > 0 and @position = 0
	IF @action = 0
	BEGIN

		SELECT
			@old_position = position,
			@old_parent_id = parent_id,
			@application_id = application_id
		FROM actions
		WHERE id = @id

		SET @parent_id = @target_id

		SELECT
			@position = COUNT(*) + 1
		FROM actions
		WHERE application_id = @application_id and parent_id = @parent_id

		UPDATE actions SET
			position = @position,
			parent_id = @parent_id
		WHERE id = @id

		UPDATE actions SET
			position = position - 1
		WHERE application_id = @application_id and parent_id = @old_parent_id and position > @old_position

	END ELSE --IF @position > 0 and @parent_id = 0
	BEGIN
		SELECT
			@old_position = position,
			@old_parent_id = parent_id,
			@application_id = application_id
		FROM actions
		WHERE id = @id

		SELECT
			@position = position,
			@new_position = position,
			@new_parent_id = parent_id
		FROM actions
		WHERE id = @target_id

		UPDATE actions SET
			position = @new_position,
			parent_id = @new_parent_id
		WHERE id = @id

		--IF @old_parent_id <> @new_parent_id
		BEGIN
			UPDATE actions SET
				position = position - 1
			WHERE application_id = @application_id and parent_id = @old_parent_id and position > @old_position and id <> @id

			UPDATE actions SET
				position = position + 1
			WHERE application_id = @application_id and parent_id = @new_parent_id and position >= @new_position and id <> @id
		END
	END
END
GO

