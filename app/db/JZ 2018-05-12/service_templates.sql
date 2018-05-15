DROP VIEW [dbo].[service_templates]
GO

CREATE VIEW [dbo].[service_templates]
AS
	SELECT        
		LOCATION_CODE as location_code,
		LETTER_CODE as code,
		MODULE_ID as service_type,
		InsertUser as create_user, 
		InsertDate as create_date, 
		UpdateUser as update_user, 
		UpdateDate as update_date
	FROM dbo.tb_lettersmodule

GO
