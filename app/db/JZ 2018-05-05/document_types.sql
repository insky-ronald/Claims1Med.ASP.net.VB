DROP VIEW [dbo].[document_types]
GO

CREATE VIEW [dbo].[document_types]
AS
	SELECT        
		LETTER_ID as id,
		LETTER_CODE as code,
		LOCATION_CODE as location_code,
		DESCRIPTION as document_type,
		FILENAME as file_name,
		IS_INVOICE as is_invoice,
		InsertUser AS create_user,
		InsertDate AS create_date,
		UpdateUser AS update_user,
		UpdateDate AS update_date
	FROM dbo.tb_document_types
GO
