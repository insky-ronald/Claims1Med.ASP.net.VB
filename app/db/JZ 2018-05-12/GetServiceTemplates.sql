DROP PROCEDURE [dbo].[GetServiceTemplates]
GO

CREATE PROCEDURE [dbo].[GetServiceTemplates]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @service_type char(3) = '',
	@type int = -1, -- 1:internal, 0:non-internal, -1:both
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    DECLARE @type1 int = 0, @type2 int = 1

	IF @type > -1
	BEGIN
		SET @type1 = @type
		SET @type2 = @type
	END

	SELECT
		t.*,
		d.template
	FROM service_templates t
	JOIN document_templates d on t.location_code = d.location_code and t.code = d.code
	WHERE t.service_type = @service_type and t.location_code = 'LDA' and d.is_internal between @type1 and @type2
	ORDER BY t.code
END
GO
