DROP VIEW [dbo].[names]
GO

CREATE VIEW [dbo].[names]
AS
	SELECT        
		COMP_ID AS id, 
		COMP_TYPE AS name_type, 
		ACCT_CODE AS account_code, 
		SPIN_ID AS spin_id, 
		FIRST_NAME AS first_name, 
		MIDDLE_NAME AS middle_name, 
		LAST_NAME AS last_name, 
		COMP_NAME AS name, 
		FULL_NAME AS full_name, 
		ADDRESS_ID AS address_id, 
		CONTACT_ID AS contact_id, 
		SEX AS gender, 
		DOB AS dob, 
		RATE_CRCY as currency_code,
		HOME_CTRY AS home_country_code, 
		NAT_CODE AS nationality_code, 
		ALPHA_ID AS alpha_id, 
		PROV_TYPE AS provider_type, 
		HOSP_TYPE AS hospital_type, 
		DOC_TYPE AS doctor_type, 
		TITLE AS title, 
		EMAIL AS email, 
		HOTLINE AS hotline, 
		PROV_TYPE AS status_code,
		IS_BLACKLISTED as blacklisted,
		InsertDate AS create_date, 
		InsertUser AS create_user, 
		UpdateDate AS update_date, 
		UpdateUser AS update_user
	FROM dbo.tb_names
GO