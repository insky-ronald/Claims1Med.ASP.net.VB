DROP PROCEDURE [dbo].[GetServiceDiagnosisGroup] 
GO

CREATE PROCEDURE [dbo].[GetServiceDiagnosisGroup] 
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @id int = 0, 
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;
	
	SELECT DISTINCT
		g.diagnosis_group,
		icd.diagnosis
	FROM claim_diagnosis g 
	JOIN icd on g.diagnosis_group = icd.code
	WHERE g.service_id = @id
	ORDER BY g.diagnosis_group
END
GO
