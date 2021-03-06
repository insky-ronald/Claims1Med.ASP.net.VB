SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
		declare @service table (
			claim_id int ,
			id int ,
			service_no varchar(22) ,
			history_id int ,
			reference_no1 varchar(20) ,
			invoice_no varchar(15) ,
			invoice_date datetime ,
			invoice_received_date datetime ,
			invoice_entry_date datetime ,
			invoice_entry_user char(10) ,
			discount_type char(1) ,
			discount_percent smallmoney ,
			discount_amount money ,
			payee_type char(1) ,
			claim_type char(4) ,
			service_sub_type char(4) ,
			claim_currency_code char(3) ,
			claim_currency_rate_date datetime ,
			claim_currency_to_base float ,
			claim_currency_to_client float ,
			claim_currency_to_eligibility float ,
			settlement_advice_notes varchar(max),
			create_date datetime ,
			create_user varchar(10) ,
			update_date datetime ,
			update_user varchar(10) ,
			has_provider_discount bit,
			protection_level int
		)

		INSERT INTO @service
			EXEC ssp_invoice @invoice_id = @id

		SELECT * FROM @service

	END ELSE IF @service_type = 'GOP'
	BEGIN
		SELECT 
			n.id,
			n.claim_id,
			n.sequence_no,
			n.version_no,
			n.service_date,
			n.service_no,
			n.claim_type,
			n.service_type,
			n.document_type,
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
			pt.full_name as patient_name,
			o.full_name as client_name,
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
