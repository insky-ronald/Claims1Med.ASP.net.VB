DROP PROCEDURE [dbo].[GetServiceInterface]
GO

CREATE PROCEDURE [dbo].[GetServiceInterface]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@service_type char(3) = '',
	@service_sub_type char(4) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	IF @service_type = 'GOP'
	BEGIN
		SELECT
			s.id,
			s.claim_id,

			--GOP_TYPE = st.SERVICE_NAME,
			st.sub_type as service_name,
			gop.gop_name,
		 
			s.start_date,
			s.end_date,
			s.provider_id,
			provider.name as provider_name,
			gop.hospital_medical_record,
			s.provider_contact_person,
			s.provider_fax_no,
			d.discount_type_id,
			CASE WHEN d.discount_type_id in (1,3,2) then s.discount_percent else s.discount_amount  end as discount,
			s.doctor_id,
			doctor.name as doctor_name,
			s.diagnosis_notes,

			gop.notes,

			s.claim_currency_code,
			gop.room_expense,
			gop.misc_expense,
			s.length_of_stay,

			--@WAITING_PERIOD as WAITING_PERIOD,

			s.create_date,
			s.create_user,
			s.update_date,
			s.update_user
		FROM services s
		JOIN gop_medical_services gop ON s.id = gop.id
		LEFT OUTER JOIN service_sub_types st on s.service_type = st.service_type and s.service_sub_type = st.code
		LEFT OUTER JOIN provider_discount d on s.provider_id = d.name_id
		LEFT OUTER JOIN names provider ON s.provider_id = provider.id
		LEFT OUTER JOIN names doctor ON s.doctor_id = doctor.id
		WHERE s.id = @id
	END 

END
GO
