DROP PROCEDURE [dbo].[SysGetReport]
GO

CREATE PROCEDURE [dbo].[SysGetReport]
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@id as int = 0,
	@visit_id as bigint = 0 /* if needed, the user will be got from here ... and subsequently, their rights*/
)
AS
BEGIN
  	SET NOCOUNT ON;

	SELECT
		s.id,
		s.name,
		s.report_type_id,
		r.report_type,
		s.query
	FROM saved_reports s
	JOIN report_types r on s.report_type_id = r.id
	WHERE s.id = @id
END
GO
