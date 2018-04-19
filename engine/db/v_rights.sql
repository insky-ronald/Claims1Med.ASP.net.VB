DROP VIEW [dbo].[v_rights]
GO

CREATE VIEW [dbo].[v_rights]
AS
	SELECT 
	  id,
	  code,
	  rights,
	  description,
	  application_id,
	  position,
	  status_code_id,
	  insert_visit_id,
	  inserted_at,
	  update_visit_id,
	  updated_at
	FROM 
	  dbo.rights;


GO


