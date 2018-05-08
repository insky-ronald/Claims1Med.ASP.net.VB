ALTER VIEW [dbo].[v_members_enquiry]
AS
	SELECT        
		m.IP_ID AS id,
		m.COMP_ID AS name_id,
		m.CERT_ID AS certificate_id,
		m.CERT_NO AS certificate_no,
		m.DEP_CODE AS dependent_code,
		m.CLT_CERT_NO AS alpha_id,
		m.FIRST_NAME AS first_name,
		m.MIDDLE_NAME AS middle_name,
		m.LAST_NAME AS last_name,
		m.MEMBER_NAME AS full_name,
		m.DOB AS dob,
		m.SEX AS sex,
		m.NAT_CODE AS nationality_code,
		m.HOME_CTRY AS home_country_code,
		m.RELATION AS relationship_code,
		r.relationship,
		m.REF_NO1 AS reference_no1,
		m.REF_NO2 AS reference_no2,
		m.REF_NO3 AS reference_no3,
		m.STATUS AS status_code,
		m.ISSUE_DATE AS issue_date,
		m.EFF_DATE AS start_date,
		m.EXP_DATE AS end_date,
		m.CANCEL_DATE AS cancelation_date,
		m.REINSTATE_DATE AS reinstatement_date,
		m.HIST_ID AS history_id,
		m.HIST_TYPE AS history_type,
		m.POLICY_ID AS policy_id,
		m.POLICY_NO AS policy_no,
		m.POL_ISSUE_DATE AS policy_issue_date,
		m.POL_EFF_DATE AS policy_start_date,
		m.POL_EXP_DATE AS policy_end_date,
		m.PLAN_CODE AS plan_code,
		m.PlanName AS plan_name,
		m.PROD_CODE AS product_code,
		m.PROD_NAME AS product_name,
		m.POLICY_HOLDER AS policy_holder,
		m.CLIENT_ID AS client_id,
		m.CLIENT_NAME AS client_name,
		m.IS_POLICY AS has_policy,
		m.IS_PLAN AS has_plan
	FROM dbo.vw_member_search m
	LEFT OUTER JOIN relationships r on m.RELATION = r.code



GO


