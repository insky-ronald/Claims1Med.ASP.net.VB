DROP PROCEDURE [dbo].[GetText]
GO

CREATE PROCEDURE [dbo].[GetText]
(
	@id as int = 0,
	@visit_id as bigint = 0
) AS
BEGIN
	SET NOCOUNT ON;

	--DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)

	SELECT 
		id,
		label,
		notes_html
	FROM
		[dbo].tb_texts
	WHERE
		id = @id
END

/*
exec GetText @id=11

*/