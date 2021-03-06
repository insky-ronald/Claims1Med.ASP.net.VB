SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetClaimServices]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@claim_id int = 0,
	@service_type char(3) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0

	IF @service_type = 'INV'
		SELECT
			s.id,
			s.claim_id,
			s.sequence_no,
			s.service_no,
			cst.sub_type,
			s.invoice_no,
			s.invoice_date,
			s.claim_currency_code,
			s.actual_amount,
			s.approved_amount,
			s.settlement_currency_code,
			s.paid_amount,
			c.eligibility_currency_code,
			s.status_code,
			ss.status,
			s.sub_status_code,
			st.sub_status
		FROM services s 
		JOIN claims c on s.claim_id = c.id
		LEFT OUTER JOIN	service_sub_types cst on s.service_type = cst.service_type and s.service_sub_type = cst.code
		LEFT OUTER JOIN	invoice_status ss on s.service_type = ss.service_type AND s.status_code = ss.code
		LEFT OUTER JOIN	sub_status_codes st ON s.service_type = st.service_type AND s.sub_status_code = st.sub_status_code
		where s.claim_id = @claim_id and s.service_type = @service_type
		
	ELSE IF @service_type = 'GOP'
		SELECT
			s.id,
			s.claim_id,
			s.sequence_no,
			s.service_no,
			cst.sub_type,
			s.start_date,
			s.end_date,
				s.invoice_no,
				s.invoice_date,
			s.claim_currency_code,
			s.actual_amount,
			s.approved_amount,
			s.settlement_currency_code,
			s.paid_amount,
			c.eligibility_currency_code,
			s.status_code,
			ss.status,
			s.sub_status_code,
			st.sub_status
		FROM services s 
		JOIN claims c on s.claim_id = c.id
		LEFT OUTER JOIN	service_sub_types cst on s.service_type = cst.service_type and s.service_sub_type = cst.code
		LEFT OUTER JOIN	invoice_status ss on s.service_type = ss.service_type AND s.status_code = ss.code
		LEFT OUTER JOIN	sub_status_codes st ON s.service_type = st.service_type AND s.sub_status_code = st.sub_status_code
		where s.claim_id = @claim_id and s.service_type = @service_type

	ELSE --IF @service_type = 'GOP'
		SELECT
			s.id,
			s.claim_id,
			s.sequence_no,
			s.service_no,
			cst.sub_type,
			s.invoice_no,
			s.invoice_date,
			s.claim_currency_code,
			s.actual_amount,
			s.approved_amount,
			s.settlement_currency_code,
			s.paid_amount,
			c.eligibility_currency_code,
			s.status_code,
			ss.status,
			s.sub_status_code,
			st.sub_status
		FROM services s 
		JOIN claims c on s.claim_id = c.id
		LEFT OUTER JOIN	service_sub_types cst on s.service_type = cst.service_type and s.service_sub_type = cst.code
		LEFT OUTER JOIN	invoice_status ss on s.service_type = ss.service_type AND s.status_code = ss.code
		LEFT OUTER JOIN	sub_status_codes st ON s.service_type = st.service_type AND s.sub_status_code = st.sub_status_code
		where s.claim_id = @claim_id and s.service_type = @service_type

END



GO
