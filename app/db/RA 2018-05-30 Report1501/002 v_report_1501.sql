USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_1501]
GO

CREATE VIEW [dbo].[v_report_1501] AS
	SELECT
	    client_id,
		client_name,
		prod_code as product_code,
		prod_name as product_name,
		invoice_id, 
		inv_status as invoice_status_code,
		inv_status_code as invoice_sub_status_code,
		inv_status_name as invoice_sub_status,
		status_date,
		status_user,
		plan_code as scheme_code,
		plan_desc as scheme,
		cert_no as certificate_id, 
		inc_date as policy_purchased_date,
		eff_date as policy_start_date,
		exp_date as policy_expiry_date,
		last_name,
		first_name,
		sex as gender,
		dob,
		claim_ref as claim_no,
		trans_date as incident_date,
		treat_ctry as area_of_loss,
		invoice_no,
		inv_date as invoice_date,
		inv_rec_date as invoice_received_date,
		payee_name,
		rec_date as notification_date,
		service_name as service_type,
		clm_crcy as invoice_currency,
		clm_amount as claimed_amount,
		clt_crcy as client_currency,
		clm_amount_bcy as client_amount,
		dec_amount as excess,
		paid_bcy as paid_amount,
		float_code,
		float_desc as float_name,
		icd_code,
		diagnosis
	FROM vw_report_1501
GO