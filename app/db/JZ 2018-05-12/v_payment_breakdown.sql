DROP VIEW [dbo].[v_payment_breakdown]
GO

CREATE VIEW [dbo].[v_payment_breakdown]
AS
	SELECT        
		PAYMENT_ID as id, 
		BATCH_NO as batch_id, 
		CLAIM_NO as claim_id, 
		CLAIM_REF as claim_no, 
		INVOICE_ID as service_id, 
		TRANS_REF as service_no, 
		INVOICE_NO as invoice_no, 
		POLICY_NO as policy_no,
		PATIENT_NAME as patient_name, 
		CLIENT_NAME as client_name, 
		FLOAT_ID as float_id, 
		FLOAT_DESC as float_name, 
		--INTER_CO as , 
		PAY_MODE as payment_mode, 
		PAYEE_ID as payee_id, 
		PAYEE_NAME as payee_name, 
		SET_CRCY as currency_code, 
		PAID as amount, 
		BASE_CRCY as base_currency_code, 
		BASE_AMOUNT as base_amount
	FROM dbo.vw_payment_breakdown
GO
