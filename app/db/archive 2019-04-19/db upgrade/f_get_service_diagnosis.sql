DROP FUNCTION [dbo].[f_get_service_diagnosis]
GO

CREATE FUNCTION [dbo].[f_get_service_diagnosis] ( @service_id int)
-- ****************************************************************************************************
-- Last modified on
-- 05-OCT-2017
-- ****************************************************************************************************
returns varchar(max)
as
begin
	DECLARE @groups table (
		diagnosis_code varchar(10),
		diagnosis varchar(300)
	)

	DECLARE @groups2 table (
		cpt_code varchar(10),
		cpt varchar(300)
	)

	DECLARE @content varchar(max)
	DECLARE @diagnosis varchar(max)

	;WITH CTE (claim_id, diagnosis_group, diagnosis_code)
	AS (
		SELECT DISTINCT
			d.claim_id,
 			d.diagnosis_group,
			d.diagnosis_code
		FROM claim_diagnosis d
			join services i on d.service_id = i.id
		where d.service_id = @service_id 
	) INSERT INTO @groups (
		diagnosis_code,
		diagnosis
	)
	SELECT DISTINCT
		x.diagnosis_group, 
		grp.diagnosis
	FROM CTE x
		left outer join icd grp on x.diagnosis_group = grp.code

	SELECT
		@diagnosis = COALESCE(@diagnosis + ', {' , '{') + ('"code":"'+rtrim(diagnosis_code)+'"' +', "diagnosis":"'+ rtrim(diagnosis) +'"}')
	FROM @groups
   	
	SET @diagnosis = '['+ @diagnosis +']'

	RETURN @diagnosis
end

GO


