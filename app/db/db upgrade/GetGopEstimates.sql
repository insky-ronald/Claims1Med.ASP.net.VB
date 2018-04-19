DROP PROCEDURE [dbo].[GetGopEstimates]
GO

CREATE PROCEDURE [dbo].[GetGopEstimates]
/****************************************************************************************************
 Update History:
 ===============
 29-SEP-2017
****************************************************************************************************/
	@id int,
	@visit_id as bigint = 0
as
begin
	SELECT
		id,
		average_cost,
		average_los,
		estimated_cost,
		estimated_los,
		estimated_provider_cost,
		estimated_provider_los
	FROM gop_estimates
	WHERE id = @id
end
GO
