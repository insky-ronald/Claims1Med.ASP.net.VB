DROP VIEW [dbo].[v_report_2001]
GO

CREATE VIEW [dbo].[v_report_2001]
/***************************************************************************************************
Last modified on
03-MAY-2018
 ***************************************************************************************************/
AS
	SELECT
		CLIENT_ID as client_id,
		CLIENT_NAME as client_name,
		POLICY_NO as policy_no,
		PLAN_CODE as plan_code,
		PLAN_DESC as plan_name,
		POLICY_HOLDER as policy_holder,
		PROD_NAME as product,
		IP_ID as member_id,
		REF_NO1 as reference_no1,
		CERT_NO as certificate_no,
		COMP_NAME as full_name,
		FIRST_NAME as first_name,
		MIDDLE_NAME as middle_name,
		LAST_NAME as last_name,
		SEX as sex,
		RELATION as relation,
		DOB as dob,
		EFF_DATE as effective_date,
		EXP_DATE as expiry_date,
		CANCEL_DATE as cancellation_date,
		CANCEL_DATE2 as cancellation_date2,
		HIST_TYPE as history_type
	FROM vw_report_2001
GO
