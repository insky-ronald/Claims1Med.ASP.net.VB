ALTER VIEW [dbo].[v_task_manager]
AS
	SELECT        
		ACTION_ID AS id,
		CLAIM_REF AS claim_no,
		CASE_OWNER AS case_owner,
		TRANS_REF AS service_no,
		TRANS_DATE AS transaction_date,
		DAY_OUT AS transaction_end_date,

		ACTION_OWNER AS action_owner,
		DUE_DATE AS due_date,
		ACTION_CLASS AS action_class_code,
		ActionClass AS action_class,
		ACTION_CODE AS action_sub_code,
		ACTION_NOTES as notes,

		ActionName AS action,
		IP_ID as member_id,
		NAME AS full_name,
		FIRST_NAME AS first_name,
		MIDDLE_NAME AS middle_name,
		LAST_NAME AS last_name,
		PROVIDER_NAME AS provider_name,
		CLAIM_NO AS claim_id,

		INVOICE_ID AS service_id,
		CLM_TYPE AS claim_type,
		CLAIM_TYPE AS claim_type_name,

		TRANS_TYPE AS service_type,
		MODULE_NAME AS service_type_name,
		CLM_SUB_TYPE AS service_sub_type,
		SUB_TYPE AS service_sub_type_name,
		CLIENT_ID AS client_id,

		CLIENT_NAME AS client_name,
		PROD_CODE AS product_code,
		PRODUCT_NAME AS product_name,
		POLICY_NO AS policy_no,
		POLICY_HOLDER AS policy_holder,
		DAYS AS days,
		IS_DUE AS is_due,

		ACTION_SET_BY AS action_set_user,
		ACTION_SET_DATE AS action_set_date,
		STATUS AS status_code,
		STATUS_DESC AS status,
		INV_STATUS AS service_status_code,
		INV_STATUS_DESC AS service_status,

		INV_STATUS_CODE AS service_sub_status_code,
		INV_STATUS_CODE_DESC AS service_sub_status,
		rtrim(ICD_CODE) AS diagnosis_code,
		SHORT_NAME AS diagnosis
	FROM dbo.vw_task_manager



GO


