DROP PROCEDURE [dbo].[GetServiceSubType]
GO

CREATE PROCEDURE [dbo].[GetServiceSubType]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@service_type char(3) = '',
	@sub_type varchar(4) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0

	IF @id > 0
	BEGIN
		SELECT
			@service_type = service_type,
			@sub_type = service_sub_type
		FROM services
		WHERE id = @id
	END

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
			gop.misc_expense,
			gop.room_expense,
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
	/*
		declare @gop table (
			claim_id int,
			service_id int,
			sub_type_name varchar(100),
			gop_type varchar(100),
			start_date datetime,
			end_date datetime,
			provider_id int,
			discount_type int,
			discount money,
			provider_name varchar(100),
			doctor_id int,
			doctor_name varchar(100),
			doctor_contact varchar(100),
			doctor_fax_no varchar(20),
			disgnosis varchar(100),
			remarks varchar(max),
			claim_currency_code char(3),
			room_expense money,
			misc_expense money,
			length_of_stay int,
			waiting_period varchar(200),
			create_date datetime, 
			create_user varchar(10),
			update_date datetime,
			update_user varchar(10)
		)

		INSERT INTO @gop
			EXEC ssp_gop_gm01 @invoice_id = @id

		SELECT * FROM @gop
		*/
	END ELSE IF @service_type = 'INV'
	BEGIN
		declare @invoice table (
			claim_id int ,
			id int ,
			claim_type char(4) ,
			service_sub_type char(4) ,
			medical_type char(1),
			start_date datetime,
			end_date datetime,
			accident_date datetime,
			provider_id int,
			discount_type char(1),
			discount money,
			provider_name varchar(100),
			doctor_id int,
			doctor_name varchar(100),
			room_type char(1),
			treatment_country_code char(3),
			procedure_code varchar(10),
			procedure_notes varchar(max),
			procedure_name varchar(900),
			waiting_period varchar(100)
		)

		INSERT INTO @invoice
			EXEC ssp_invoice_m003 @invoice_id = @id

		SELECT * FROM @invoice

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
		LEFT OUTER JOIN	service_sub_types cst on s.service_type = cst.service_type and s.service_sub_type = cst.code
		LEFT OUTER JOIN	invoice_status ss on s.service_type = ss.service_type AND s.status_code = ss.code
		LEFT OUTER JOIN	sub_status_codes st ON s.service_type = st.service_type AND s.sub_status_code = st.sub_status_code
		where s.id = @id

END
GO
