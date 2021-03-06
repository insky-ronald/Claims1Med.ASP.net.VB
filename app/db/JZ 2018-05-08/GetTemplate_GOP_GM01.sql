DROP PROCEDURE [dbo].[GetTemplate_GOP_GM01]
GO

CREATE PROCEDURE [dbo].[GetTemplate_GOP_GM01]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@claim_id int = 0,
	@service_id int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_name varchar(10)

	SELECT
		@user_name = u.user_name
	FROM visits v
	JOIN users u on v.user_id = u.id
	WHERE v.id = @visit_id

	DECLARE @template table (
		date datetime,
		reference_no varchar(25),
		sender_name varchar(100),
		sender_designation varchar(50),
		service_type char(100),

		client_name varchar(100),
		patient_name varchar(100),
		policy_no varchar(25),
		certificate_no varchar(25),

		gop_name varchar(100),
		provider_name varchar(100),
		doctor_name varchar(100),
		start_date datetime,
		end_date datetime,
		length_of_stay int,
            
		condition varchar(max),
		
		currency_code char(3),
		misc_amount money,
		rnb_amount money,
	
		provider_address1 varchar(100),		
		provider_address2 varchar(100),		
		provider_address3 varchar(100),

		owner_address1 varchar(100),
		owner_address2 varchar(100),
		owner_address3 varchar(100),

		remarks varchar(max)
	)

	INSERT INTO @template
		EXEC ssp_letter_gop_gm01
			@CLAIM_NO = @claim_id,
			@INVOICE_ID = @service_id,
			@USER_NAME = @user_name

	UPDATE @template SET 
		--date = s.service_date,
		service_type = 'HOSPITALISATION',
		gop_name = st.display_name
	FROM services s
	JOIN service_types st on s.service_sub_type = st.code
	WHERE s.id = @service_id
/*
	UPDATE @template SET 
		gop_name = st.display_name
	FROM services s
	JOIN service_types st on s.service_sub_type = st.code
	WHERE s.id = @service_id
	*/
	SELECT * FROM @template
END
GO
