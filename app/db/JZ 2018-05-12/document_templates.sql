DROP VIEW [dbo].[document_templates]
GO

CREATE VIEW [dbo].[document_templates]
AS
	SELECT        
		LETTER_ID as id,
		LOCATION_CODE as location_code,
		LETTER_CODE as code,
		DESCRIPTION as template,
		FILENAME as data_source_name,
		is_internal,
		InsertUser as create_user, 
		InsertDate as create_date, 
		UpdateUser as update_user, 
		UpdateDate as update_date
	FROM dbo.tb_letters

GO
