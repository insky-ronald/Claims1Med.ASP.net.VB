DROP PROCEDURE [dbo].[GetService]
GO

CREATE PROCEDURE [dbo].[GetService]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@service_type char(3) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0

	IF @service_type = 'INV'
	BEGIN
		SELECT 
			s.id,
			s.claim_id, 
			s.service_no,
			s.service_type,
			s.service_sub_type,
			s.service_date,
			s.status_code,
			s.sub_status_code,
			--C.HIST_ID, 
			s.reference_no1,
			s.invoice_no,
			s.invoice_date,
			s.invoice_received_date,
			s.invoice_entry_date,
			s.invoice_entry_user,
			s.discount_type,
			s.discount_percent,
			s.discount_amount,
			s.payee_type,
			s.claim_currency_code,
			s.claim_currency_rate_date,
			s.claim_currency_to_base,
			s.claim_currency_to_eligibility,
			s.claim_currency_to_client,
			--C.SET_ADVICE_NOTES,
			s.create_date,
			s.create_user,
			s.update_date,
			s.update_user,
			has_provider_discount = cast(
					case 
						when p.discount_type_id in ('1','3','2','4') then 1 
						else 0 
					end 
				as bit), 
			protection_level = cast(
					case 
						when s.status_code = 'E' then 1
						when s.status_code = 'A' then 2
						when s.status_code = 'S' then 3
						else 0
					end 
				as int),

			provider_id = CAST(0 as int),
			provider_invoice_id = CAST(0 as int)
		FROM services s
		LEFT OUTER JOIN provider_discount p on s.provider_id = p.name_id
		WHERE s.id = @id

	END ELSE IF @service_type = 'GOP'
	BEGIN
		SELECT 
			n.id,
			n.claim_id,
			n.service_no,
			n.service_type,
			n.service_sub_type,
			n.service_date,
			n.status_code,
			n.sub_status_code,
			n.sequence_no,
			n.version_no,
			n.claim_type,
			n.document_type,
			c.client_currency_code,
			c.base_currency_code,
			c.eligibility_currency_code,
			n.claim_currency_code,
			n.claim_currency_rate_date,
			n.claim_currency_to_base,
			n.claim_currency_to_client,
			n.claim_currency_to_eligibility,
			n.settlement_advice_id,
			n.discount_type,
			n.discount_percent,
			n.discount_amount,
			g.admission_first_call,
			g.admission_document_received,
			g.admission_sending_document,
			g.admission_document_received2,
			g.admission_document_received3,
			g.admission_initial_gop,
			g.admission_tat_first_call,
			g.admission_tat_complete_document,
			g.discharge_first_call,
			g.discharge_document_received,
			g.discharge_sending_document,
			g.discharge_document_received2,
			g.discharge_document_received3,
			g.discharge_final_gop,
			g.discharge_tat_first_call,
			g.discharge_tat_complete_document,
			p.policy_no,
			pt.name as patient_name,
			o.name as client_name,
			isnull(g.link_invoice_id, 0) AS link_invoice_id,
			cast(case when n.discount_type in ('1','3','2','4') then 1 else 0 end as bit) as has_provider_discount,
			n.create_date,
			n.create_user,
			n.update_date,
			n.update_user
		from services n
			left outer join gop_medical_services g on n.id = g.id
			left outer join claims c on n.claim_id = c.id
			left outer join policies p on c.policy_id = p.id
			left outer join names o on c.client_id = o.id
			left outer join names pt on c.name_id = pt.id
	        
	   WHERE N.id = @id

	END ELSE --IF @service_type = 'GOP'
		SELECT
			s.id,
			s.claim_id,
			s.sequence_no,
			s.service_no,
			s.service_type,
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
		LEFT OUTER JOIN	claim_sub_types cst on s.service_type = cst.service_type and s.claim_sub_type = cst.code
		LEFT OUTER JOIN	invoice_status ss on s.service_type = ss.service_type AND s.status_code = ss.code
		LEFT OUTER JOIN	sub_status_codes st ON s.service_type = st.service_type AND s.sub_status_code = st.sub_status_code
		where s.id = @id

END
GO
