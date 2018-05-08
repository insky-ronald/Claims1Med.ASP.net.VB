ALTER VIEW [dbo].[claim_procedures]
AS
	SELECT        
		RECORD_ID AS id,
		CLAIM_NO AS claim_id,
		INVOICE_ID AS service_id,
		rtrim(ICD_CODE) AS code,
		rtrim(ICD_GROUP) As diagnosis_code,
		SURG_TYPE as procedure_type,
		--CONDITION AS condition,
		InsertUser AS create_user,
		InsertDate AS create_date,
		UpdateUser AS update_user,
		UpdateDate AS update_date
	FROM dbo.tb_claim_diagnosis
	WHERE DIAGNOSIS_TYPE = 'P'

GO


