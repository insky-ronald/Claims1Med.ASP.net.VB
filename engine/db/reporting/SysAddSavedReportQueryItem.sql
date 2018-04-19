DROP PROCEDURE [dbo].[SysAddSavedReportQueryItem]
GO

CREATE PROCEDURE [dbo].[SysAddSavedReportQueryItem]
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id as int = 0,
	@name varchar(100) = '',
	@value varchar(2048) = '',
	@visit_id as bigint = 0
) AS
BEGIN
	SET NOCOUNT ON;

	
	IF EXISTS(SELECT * FROM saved_report_items WHERE id = @id AND name = @name)
	BEGIN
		IF LEN(@value) = 0
			DELETE saved_report_items WHERE id = @id AND name = @name
		ELSE
			UPDATE saved_report_items SET value = @value WHERE id = @id AND name = @name
	END 
	ELSE --IF LEN(@value) > 0
	BEGIN	
		INSERT INTO saved_report_items (
			id,
			name,
			value
		) VALUES (
			@id,
			@name,
			@value
		)
	END
END
GO
