ALTER VIEW [dbo].[v_members_enquiry]
AS
	SELECT        
		IP_ID AS id,
		COMP_ID AS name_id,
		CERT_ID AS certificate_id,
		CERT_NO AS certificate_no,
		DEP_CODE AS dependent_code,
		CLT_CERT_NO AS alpha_id,
		FIRST_NAME AS first_name,
		MIDDLE_NAME AS middle_name,
		LAST_NAME AS last_name,
		MEMBER_NAME AS full_name,
		DOB AS dob,
		SEX AS sex,
		NAT_CODE AS nationality_code,
		HOME_CTRY AS home_country_code,
		RELATION AS relationship_code,
		REF_NO1 AS reference_no1,
		REF_NO2 AS reference_no2,
		REF_NO3 AS reference_no3,
		STATUS AS status_code,
		ISSUE_DATE AS issue_date,
		EFF_DATE AS start_date,
		EXP_DATE AS end_date,
		CANCEL_DATE AS cancelation_date,
		REINSTATE_DATE AS reinstatement_date,
		HIST_ID AS history_id,
		HIST_TYPE AS history_type,
		POLICY_ID AS policy_id,
		POLICY_NO AS policy_no,
		POL_ISSUE_DATE AS policy_issue_date,
		POL_EFF_DATE AS policy_start_date,
		POL_EXP_DATE AS policy_end_date,
		PLAN_CODE AS plan_code,
		PlanName AS plan_name,
		PROD_CODE AS product_code,
		PROD_NAME AS product_name,
		POLICY_HOLDER AS policy_holder,
		CLIENT_ID AS client_id,
		CLIENT_NAME AS client_name,
		IS_POLICY AS has_policy,
		IS_PLAN AS has_plan
	FROM dbo.vw_member_search



GO


