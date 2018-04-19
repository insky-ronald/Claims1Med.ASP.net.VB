DROP VIEW [dbo].[gop_medical_services]
GO

CREATE VIEW [dbo].[gop_medical_services]
AS
	SELECT        
		INVOICE_ID AS id,
		ROOM_EXP AS room_expense,
		MISC_EXP AS misc_expense,
		REMARKS AS notes,
		GOP_NAME AS gop_name,
		ADMIT_FIRST_CALL AS admission_first_call,
		ADMIT_DOC_RCVD AS admission_document_received,
		ADSENDING_DOC AS admission_sending_document,
		ADDOC_REC2 AS admission_document_received2,
		ADDOC_REC3 AS admission_document_received3,
		ADMIN_INITIAL_GOP AS admission_initial_gop,
		ADMIT_TAT_FIRST_CALL AS admission_tat_first_call,
		ADMIT_TAT_DOC_COMP AS admission_tat_complete_document,
		DISCH_FIRST_CALL AS discharge_first_call,
		DISCH_DOC_RCVD AS discharge_document_received,
		DISSENDING_DOC AS discharge_sending_document,
		DISDOC_REC2 AS discharge_document_received2,
		DISDOC_REC3 AS discharge_document_received3,
		DISCH_FINAL_GOP AS discharge_final_gop,
		DISCH_TAT_FIRST_CALL AS discharge_tat_first_call,
		DISCH_TAT_DOC_COMP AS discharge_tat_complete_document,
		LINK_INVOICE_ID as link_invoice_id,
		HOSP_MEDICAL_RECORD as hospital_medical_record,
		InsertDate AS create_date,
		InsertUser AS create_user,
		UpdateDate AS update_date,
		UpdateUser AS update_user
	FROM dbo.tb_gop_medical_services
GO
