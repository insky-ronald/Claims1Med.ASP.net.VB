DROP PROCEDURE [dbo].[GetGopCalculationDates]
GO

CREATE PROCEDURE [dbo].[GetGopCalculationDates]
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
		admission_first_call,
		admission_document_received,
		admission_sending_document,
		admission_document_received2,
		admission_document_received3,
		admission_initial_gop,
		admission_tat_first_call,
		admission_tat_complete_document,

		discharge_first_call,
		discharge_document_received,
		discharge_sending_document,
		discharge_document_received2,
		discharge_document_received3,
		discharge_final_gop,
		discharge_tat_first_call,
		discharge_tat_complete_document,

		create_date,
		create_user,
		update_date,
		update_user
	FROM gop_medical_services
	WHERE id = @id
end
GO
