DROP PROCEDURE [dbo].[GetClaimProcedures] 
GO

CREATE PROCEDURE [dbo].[GetClaimProcedures] 
-- ***************************************************************************************************
-- Last modified on
-- 14-OCT-2014 ihms.0.0.1.0
-- *************************************************************************************************** 
(
    @id int = 0, 
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	SELECT
		p.id,
		p.claim_id,
		p.service_id,
		p.code,
		p.diagnosis_code,
		--p.procedure_type,
		procedure_type_name = cast(case cpt.procedure_type when 1 then 'Minor' when 2 then 'Intermediate' when 3 then 'Major' when 4 then 'Complex' else 'N/A' end as varchar(60)),
		cpt.cpt
	FROM claim_procedures p
	JOIN cpt on p.code = cpt.code
	WHERE service_id = @id
END
GO
