DROP PROCEDURE [dbo].[GetInvoicePayment]
GO

CREATE PROCEDURE [dbo].[GetInvoicePayment]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
@id int = 0,
@visit_id AS bigint = 0
AS
BEGIN
    SET NOCOUNT ON;

	SELECT 
		s.id,
		s.payee_type,
		s.payee_id,
		s.payee_name, 
		s.payment_mode, 
		s.delivery_mode,
		/*
		s.PAYMENT_TERMS,
		s.SOS_SEND_TO,
		s.CLEAR_CTRY,
		*/
		s.float_id,
		f.float_name,
		s.settlement_currency_code, 
		s.approved_amount, 
		s.paid_amount, 
		s.settlement_currency_manual_rate,
		s.settlement_currency_rate_date,
		s.settlement_currency_to_claim, 
		s.settlement_currency_to_base, 
		s.settlement_currency_to_client, 
		s.settlement_currency_to_eligibility,

		s.bank_id,
		bank_name = case when p.id is NULL then b.bank_name else p.bank_name end,
		bank_route_code =	case when p.id is null then  
							case when s.settlement_currency_code = 'GBP' then b.sort_code else b.swift_code end
							else p.bank_route_code end,
		beneficiary_name = case when p.id is null then b.beneficiary_name else p.beneficiary_name end,
		beneficiary_bank_acno = case when p.id is null then b.beneficiary_bank_account else p.beneficiary_bank_account end,
		beneficiary_address1 = case when p.id is null then b.beneficiary_address1 else p.beneficiary_address1 end,
		beneficiary_address2 = case when p.id is null then b.beneficiary_address2 else p.beneficiary_address2 end,
		beneficiary_address3 = case when p.id is null then b.beneficiary_address3 else p.beneficiary_address3 end,
		beneficiary_ctry = case when p.id is null then b.beneficiary_country_code else p.beneficiary_country_code end,
		bank_address1 = case when p.id is null then b.bank_address1 else p.bank_address1 end,
		bank_address2 = case when p.id is null then b.bank_address2 else p.bank_address2 end,
		bank_address3 = case when p.id is null then b.bank_address3 else p.bank_address3 end,
		bank_country_code = case when p.id is null then b.bank_country_code else p.bank_country_code end,
		
		p.currency_code,
		p.amount,
		p.cb_cheque_no,
		p.cb_value_date,
		p.cb_cash_date,
		p.cb_rate,
		p.cb_status,
		
		p.currency_code,
		p.amount,
		s.batch_id,
		s.payment_id
	FROM services s
		left outer join floats f on s.float_id = f.id
		left outer join banks b on s.bank_id = b.id
		left outer join payments p on s.payment_id = p.id
	WHERE s.id = @id
END

