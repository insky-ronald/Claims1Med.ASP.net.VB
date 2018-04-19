DROP FUNCTION [dbo].[f_get_diagnosis_groups]
GO

CREATE FUNCTION [dbo].[f_get_diagnosis_groups] ( @claim_id int)
-- ****************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- ****************************************************************************************************
returns varchar(max)
as
begin
	DECLARE @groups table (
		diagnosis_code varchar(10),
		diagnosis varchar(300),
		prepend varchar(10) -- #206
	)


	;WITH CTE (claim_id, diagnosis_group, diagnosis_code, prepend)
	AS (
		SELECT DISTINCT
			d.claim_id,
 			d.diagnosis_group,
			d.diagnosis_code,
			CAST(CASE WHEN i.service_type = 'GOP' AND i.status_code = 'D' THEN '0' ELSE '1' END as varchar(10)) as prepend -- #206
		FROM claim_diagnosis d
			join claims c on d.claim_id = c.id
			join services i on d.service_id = i.id
		where c.is_deleted = 0
		and isnull(i.is_deleted, 0) = 0 
		and (i.service_type = 'INV' or 
				(i.service_type = 'GOP' 
					and (I.sub_status_code in ('N01', 'N02','S01','S08') 
					or I.status_code = 'P' 
					or I.status_code = 'D' -- #206, include declined/canceled GOPs
					)
				)
			) --> GOP NOT SUPERCEDED and NOT INVOICE RECEIVED - Added on 2013-APR-9
		and c.id = @claim_id
	) INSERT INTO @groups (
		diagnosis_code,
		diagnosis,
		prepend -- #206
	)
	SELECT DISTINCT
		x.diagnosis_group, 
		grp.diagnosis,
		x.prepend -- #206
	FROM CTE x
		left outer join icd grp on x.diagnosis_group = grp.code

	DECLARE @diagnosis varchar(max)

	SELECT
		--@diagnosis = COALESCE(@diagnosis, '') + (prepend+rtrim(diagnosis_code) +',')
		@diagnosis = COALESCE(@diagnosis + ',', '') + '{"code":"'+rtrim(diagnosis_code)+'", "diagnosis":"'+diagnosis+'", "status":'+prepend+'}'
		--@diagnosis = COALESCE(@diagnosis, '') + (','+prepend+rtrim(diagnosis_code))
	FROM @groups

	SET @diagnosis = '['+ISNULL(@diagnosis, '')+']'
   	
	return @diagnosis
end

GO


