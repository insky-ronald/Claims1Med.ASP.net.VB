DROP VIEW [dbo].[v_payments]
GO

CREATE VIEW [dbo].[v_payments]
AS
	SELECT        
		PAYMENT_ID as id, 
		BATCH_NO as batch_id, 
		CLIENT_NAME as client_name, 
		FLOAT_ID as float_id, 
		FLOAT_DESC as float_name, 
		PAY_MODE as payment_mode, 
		PAYEE_ID as payee_id, 
		PAYEE_NAME as payee_name, 
		CRCY_CODE as currency_code, 
		AMOUNT as amount, 
		BASE_CRCY as base_currency_code, 
		BASE_AMOUNT as base_amount
	FROM dbo.vw_payments
GO
