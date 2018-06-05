USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_1503]
GO

CREATE VIEW [dbo].[v_report_1503] AS
	SELECT
	    client_id,
		client_name,
		prod_code as product_code,
		prod_name as product_name,
		invoice_id, 
		inv_status as invoice_status_code,
		inv_status_code as invoice_sub_status_code,
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
		rec_date as notification_date,
		service_name as service_type,
		clm_crcy as invoice_currency,
		clm_amount as claimed_amount,
		clt_crcy as client_currency,
		clm_amount_bcy as client_amount
	FROM vw_report_1503
GO