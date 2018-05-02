DROP VIEW [dbo].[v_payment_batching] 
GO

CREATE VIEW [dbo].[v_payment_batching] 
AS
	SELECT
		claim_id = CLAIM_NO,
		service_id = INVOICE_ID,
		claim_no = CLAIM_REF,
		service_no = TRANS_REF,
		service_type = TRANS_TYPE,
		invoice_no = INVOICE_NO,
		invoice_date = INV_DATE,
		invoice_date_received = REC_DATE,
		invoice_input_date = INV_INP_DATE,
		certificate_no = CERT_NO,
		patient_name = PATIENT_NAME,
		status_code = STATUS,
		sub_status_code = STATUS_CODE,
		interco_reference = INTER_CO,
			--IS_SPIN,
		payee_type = PAYEE_TYPE,
		payee_id = PAYEE_ID,
		payee_name = PAYEE_NAME,
		payment_id = PAYMENT_ID,
		batch_id = BATCH_NO,
		payment_mode = PAY_MODE,
		settlement_currency_code = SET_CRCY,
		paid = PAID,
		client_id = CLIENT_ID,
		client_name = CLIENT_NAME,
		float_id = FLOAT_ID,
		float_name = FLOAT_DESC,
			--CLM_CRCY,
			--CLM_AMOUNT,
		base_currency_code = BASE_CRCY,
		paid_base = BASE_AMOUNT,
			--CLT_CRCY,
			--CLT_AMOUNT,
			--ELG_CRCY,`
			--ELG_AMOUNT,
		case_owner = CASE_OWNER,
		update_user = UpdateUser,
		update_date = UpdateDate,
		create_date = InsertDate,
		authorised_user = AUTH_USER,
		authorised_date = AUTH_DATE,
		batching_user = BATCH_USER,
		batching_date = BATCH_DATE,
			--IS_AUTO_VALIDATE,
		validation_mode = ValidationMode,
		policy_no = POLICY_NO,
		policy_holder = POLICY_HOLDER,
		provider_name = PROVIDER_NAME,
		admission_date = DAY_IN,
		discharge_date = DAY_OUT,
		approved_date = E01_DATE,
		approved_user = E01_USER,

	    authorised = cast(BATCH_READY as int),
		authorised_amount = BATCH_AMOUNT
	FROM vw_payment_batching
GO


