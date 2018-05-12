ALTER PROCEDURE [dbo].[GetService]
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

	IF @id > 0
		SELECT
			@service_type = service_type
		FROM services WHERE id = @id

	IF @service_type = 'INV'
	BEGIN
		SELECT 
			s.id,
			s.claim_id, 
			c.claim_no,
			s.service_no,
			s.service_type,
			s.service_sub_type,
			s.service_date,
			s.status_code,
			s.sub_status_code,
			s.reference_no1,
			s.invoice_no,
			s.invoice_date,
			s.invoice_received_date,
			s.invoice_entry_date,
			s.invoice_entry_user,
			u3.name AS invoice_entry_user_name,
			s.discount_type,
			s.discount_percent,
			s.discount_amount,
			s.payee_type,
			s.payment_mode,
			c.client_currency_code,
			c.base_currency_code,
			c.eligibility_currency_code,
			s.claim_currency_code,
			s.claim_currency_rate_date,
			s.claim_currency_to_base,
			s.claim_currency_to_eligibility,
			s.claim_currency_to_client,
			s.settlement_advice_notes,
			c.client_id,
			c.policy_id,
			p.policy_no,
			m.plan_code,
			c.member_id,
			pt.name as patient_name,
			o.name as client_name,
			s.link_gop_id as link_service_id,
			link.service_no as link_service_no,
			cast(case when s.discount_type in ('1','3','2','4') then 1 else 0 end as bit) as has_provider_discount,

			-- Medical Invoice
			s.medical_type,
			s.room_type,
			s.treatment_country_code,
			s.start_date,
			s.end_date,
			c.accident_date,
			s.provider_id,
			provider.name as provider_name,
			d.discount_type_id,
			s.doctor_id,
			doctor.name as doctor_name,

			s.create_date,
			s.create_user,
			s.update_date,
			s.update_user,
			u1.name AS create_user_name,
			u2.name AS update_user_name
		FROM services s
			join claims c on s.claim_id = c.id
			join members m on c.member_id = m.id
			left outer join service_sub_types st on s.service_type = st.service_type and s.service_sub_type = st.code
			left outer join policies p on c.policy_id = p.id
			left outer join names o on c.client_id = o.id
			left outer join names pt on c.name_id = pt.id
			left outer join names provider on s.provider_id = provider.id
			left outer join names doctor on s.doctor_id = doctor.id
			left outer join provider_discount d on s.provider_id = d.name_id
			left outer join services link on s.link_gop_id = link.id
			left join users u1 ON s.create_user = u1.user_name 
			left join users u2 on s.update_user = u2.user_name
			left join users u3 on s.invoice_entry_user = u3.user_name
		WHERE s.id = @id

	END ELSE IF @service_type = 'GOP'
	BEGIN
		SELECT 
			s.id,
			s.claim_id,
			c.claim_no,
			s.service_no,
			s.service_type,
			s.service_sub_type,
			s.service_date,
			s.status_code,
			s.sub_status_code,
			s.sequence_no,
			s.version_no,
			s.claim_type,
			s.document_type,
			c.client_currency_code,
			c.base_currency_code,
			c.eligibility_currency_code,
			s.claim_currency_code,
			s.claim_currency_rate_date,
			s.claim_currency_to_base,
			s.claim_currency_to_client,
			s.claim_currency_to_eligibility,
			s.settlement_advice_id,
			s.discount_type,
			s.discount_percent,
			s.discount_amount,
			/* g.admission_first_call,
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
			g.discharge_tat_complete_document, */
			c.client_id,
			c.policy_id,
			p.policy_no,
			m.plan_code,
			c.member_id,
			pt.name as patient_name,
			o.name as client_name,
			isnull(g.link_invoice_id, 0) AS link_service_id,
			link.service_no as link_service_no,
			cast(case when s.discount_type in ('1','3','2','4') then 1 else 0 end as bit) as has_provider_discount,

			-- Medical GOP
			s.start_date,
			s.end_date,
			s.provider_id,
			provider.name as provider_name,
			g.hospital_medical_record,
			s.provider_contact_person,
			s.provider_fax_no,
			d.discount_type_id,
			s.doctor_id,
			doctor.name as doctor_name,
			s.diagnosis_notes,
			g.notes,
			g.misc_expense,
			g.room_expense,
			s.length_of_stay,
			-- Medical GOP

			s.create_date,
			s.create_user,
			s.update_date,
			s.update_user,
			u1.name AS create_user_name,
			u2.name AS update_user_name
		from services s
			JOIN gop_medical_services g ON s.id = g.id
			join claims c on s.claim_id = c.id
			join members m on c.member_id = m.id
			--left outer join gop_medical_services g on s.id = g.id
			left outer join service_sub_types st on s.service_type = st.service_type and s.service_sub_type = st.code
			left outer join policies p on c.policy_id = p.id
			left outer join names o on c.client_id = o.id
			left outer join names pt on c.name_id = pt.id
			left outer join names provider on s.provider_id = provider.id
			left outer join names doctor on s.doctor_id = doctor.id
			left outer join provider_discount d on s.provider_id = d.name_id
			left outer join services link on g.link_invoice_id = link.id
			left join users u1 ON s.create_user = u1.user_name 
			left join users u2 on s.update_user = u2.user_name
	   WHERE s.id = @id

	END ELSE --IF @service_type = 'GOP'
		SELECT
			s.id,
			s.claim_id,
			s.sequence_no,
			ISNULL(s.document_type, '') as document_type,
			s.status_code,
			s.sub_status_code
		FROM services s 
		JOIN claims c on s.claim_id = c.id
		where s.id = @id

END
