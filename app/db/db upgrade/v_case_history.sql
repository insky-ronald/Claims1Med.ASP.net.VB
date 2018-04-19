DROP VIEW [dbo].[v_case_history] 
GO

/****** Object:  View [dbo].[v_actions]    Script Date: 10/5/2017 3:46:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[v_case_history] 
AS
	SELECT
		IP_ID as member_id,
		CLAIM_NO as claim_id,
		INVOICE_ID as service_id,
		CLAIM_REF as claim_no,
		TRANS_REF as service_no,
		CLM_TYPE as claim_type,
		TRANS_TYPE as service_type,
		service_name,
		PLAN_CODE as plan_code,
		TRANS_DATE as start_date,
		DAY_OUT as end_date,
		provider_name,
		doctor_name,
		CLM_CRCY as claim_currency_code,
		ACTUAL as actual_amount,
		APPROVED as approved_amount,
		DECLINED as declined_amount,
		DEDUCTIBLE as deductible_amount,
		case_status,
		dbo.f_get_service_diagnosis(INVOICE_ID) as diagnosis_list,
		dbo.f_get_service_procedure(INVOICE_ID) as procedure_list
	FROM vw_case_history
GO


