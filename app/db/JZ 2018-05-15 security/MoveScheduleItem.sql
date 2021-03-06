USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[MoveScheduleItem]
GO

CREATE PROCEDURE [dbo].[MoveScheduleItem]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@target_id int = 0,
	@action int = 0, --0:move, 1:re-position
	@position int = 0,
	@parent_id int = 0,
    @visit_id as bigint = 0,
	@action_status_id as int = 0 OUTPUT,
	@action_msg as varchar(200) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @item_no int
	DECLARE @old_parent_id int
	DECLARE @old_item_no int
	DECLARE @new_parent_id int
	DECLARE @new_item_no int

	--IF @parent_id > 0 and @position = 0
	IF @action = 0
	BEGIN

		SELECT
			@old_item_no = item_id,
			@old_parent_id = parent_id
		FROM schedule
		WHERE id = @id

		SET @parent_id = @target_id

		SELECT
			@item_no = COUNT(*) + 1
		FROM schedule
		WHERE parent_id = @parent_id

		UPDATE schedule SET
			item_id = @item_no,
			parent_id = @parent_id
		WHERE id = @id

		UPDATE schedule SET
			item_id = item_id - 1
		WHERE parent_id = @old_parent_id and item_id > @old_item_no

	END ELSE --IF @position > 0 and @parent_id = 0
	BEGIN
		SELECT
			@old_item_no = item_id,
			@old_parent_id = parent_id
		FROM schedule
		WHERE id = @id

		SELECT
			@item_no = item_id,
			@new_item_no = item_id,
			@new_parent_id = parent_id
		FROM schedule
		WHERE id = @target_id

		UPDATE schedule SET
			item_id = @new_item_no,
			parent_id = @new_parent_id
		WHERE id = @id

		--IF @old_parent_id <> @new_parent_id
		BEGIN
			UPDATE schedule SET
				item_id = item_id - 1
			WHERE parent_id = @old_parent_id and item_id > @old_item_no and id <> @id

			UPDATE schedule SET
				item_id = item_id + 1
			WHERE parent_id = @new_parent_id and item_id >= @new_item_no and id <> @id
		END

		/*
		UPDATE schedule SET
			item_id = @position
		WHERE id = @id and parent_id = @old_parent_id

		IF @old_item_no > @position
			UPDATE schedule SET
				item_id = item_id + 1
			WHERE parent_id = @old_parent_id and item_id >= @position and item_id < @old_item_no and id <> @id
		ELSE IF @old_item_no < @position
			UPDATE schedule SET
				item_id = item_id - 1
			WHERE parent_id = @old_parent_id and item_id > @old_item_no and item_id <= @position and id <> @id
			*/
	END

	-- select top 10 * from schedule
END
GO

