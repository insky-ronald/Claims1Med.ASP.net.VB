DROP FUNCTION [dbo].[f_get_service_procedure]
GO

CREATE FUNCTION [dbo].[f_get_service_procedure] ( @service_id int)
-- ****************************************************************************************************
-- Last modified on
-- 05-OCT-2017
-- ****************************************************************************************************
returns varchar(max)
as
begin
	DECLARE @groups table (
		code varchar(10),
		cpt varchar(300)
	)

	DECLARE @content varchar(max)
	DECLARE @cpt varchar(max)

	;WITH CTE (claim_id, code)
	AS (
		SELECT DISTINCT
			d.claim_id,
			d.code
		FROM claim_procedures d
			join services i on d.service_id = i.id
		where d.service_id = @service_id 
	) INSERT INTO @groups (
		code,
		cpt
	)
	SELECT DISTINCT
		x.code, 
		cpt.cpt
	FROM CTE x
		left outer join cpt on x.code = cpt.code

	SELECT
		@cpt = COALESCE(@cpt + ', {' , '{') + ('"code":"'+rtrim(code)+'"' +', "cpt":"'+ rtrim(cpt) +'"}')
	FROM @groups
   	
	SET @cpt = '['+ ISNULL(@cpt, '') +']'

	RETURN @cpt
end

GO


