DROP VIEW [dbo].[claim_notes]
GO

CREATE VIEW [dbo].[claim_notes]
AS
	SELECT        
		NOTE_ID AS id,
		CLAIM_NO AS claim_id,
		INVOICE_ID AS service_id,
		NOTE_CODE AS note_type,
		SUB_CODE AS note_sub_type,
		NOTES AS notes,
		IsDeleted AS is_deleted,
		InsertDate AS create_date,
		InsertUser AS create_user,
		UpdateDate AS update_date,
		UpdateUser AS update_user
	FROM dbo.tb_claim_notes
GO
