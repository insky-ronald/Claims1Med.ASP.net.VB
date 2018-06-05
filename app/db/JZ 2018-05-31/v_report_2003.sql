USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_2003]
GO

CREATE VIEW [dbo].[v_report_2003] AS
SELECT
	ID as id,
	client_id,
	policy_id,
	policy_holder as policy_name,
	policy_no,
	claim_no,
	Claimant as patient,
	trans_ref as service_no,
	treatment_date,
	icd_code,
	icd_desc as diagnosis,
	prov_id as provider_id,
	provider_name,
	doc_id as physician_id,
	doctor_name as physician,
	length_of_stay,
	clm_type as claim,
	clm_sub_Type as claim_sub_type,
	service_name as claim_type,
	Age as age,
	AgeBand as age_band,
	Status as status,
	status_desc as status_description
FROM vw_report_2003

GO