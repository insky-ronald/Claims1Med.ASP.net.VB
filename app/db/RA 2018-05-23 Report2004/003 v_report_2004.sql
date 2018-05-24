USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_2004]
GO

CREATE VIEW [dbo].[v_report_2004] AS
SELECT
	ID as id,
	client_id,
	case_opened,
	claim_no,
	reference_no as service_no,
	invoice_no as service_id,
	status,
	status_desc,
	claimant,
	policy_no,
	plan_desc,
	age,
	AgeBand as age_band,
	sex,
	clm_type as claim_type,
	clm_sub_type as claim_sub_type,
	service_name,
	incident_date,
	prov_id as provider_id,
	provider_name,
	doc_id as doctor_id,
	doctor_name,
	actual as amount,
	icd_code,
	icd_desc as diagnosis
FROM vw_report_2004

GO

