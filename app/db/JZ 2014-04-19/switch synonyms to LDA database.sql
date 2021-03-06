USE [MEDICS52]
GO
DROP SYNONYM [dbo].[vw_task_manager]
GO
DROP SYNONYM [dbo].[vw_member_search]
GO
DROP SYNONYM [dbo].[vw_claim_status_history]
GO
DROP SYNONYM [dbo].[vw_case_history]
GO
DROP SYNONYM [dbo].[vw_account_clients]
GO
DROP SYNONYM [dbo].[tb_users]
GO
DROP SYNONYM [dbo].[tb_usergroups]
GO
DROP SYNONYM [dbo].[tb_sub_status_codes]
GO
DROP SYNONYM [dbo].[tb_sub_claim_types]
GO
DROP SYNONYM [dbo].[tb_status_codes]
GO
DROP SYNONYM [dbo].[tb_services]
GO
DROP SYNONYM [dbo].[tb_service_types]
GO
DROP SYNONYM [dbo].[tb_service_status_history]
GO
DROP SYNONYM [dbo].[tb_service_actions]
GO
DROP SYNONYM [dbo].[tb_schedule]
GO
DROP SYNONYM [dbo].[tb_provider_discount]
GO
DROP SYNONYM [dbo].[tb_products]
GO
DROP SYNONYM [dbo].[tb_policies]
GO
DROP SYNONYM [dbo].[tb_plans]
GO
DROP SYNONYM [dbo].[tb_plan_history]
GO
DROP SYNONYM [dbo].[tb_note_types]
GO
DROP SYNONYM [dbo].[tb_note_sub_types]
GO
DROP SYNONYM [dbo].[tb_nationality]
GO
DROP SYNONYM [dbo].[tb_names]
GO
DROP SYNONYM [dbo].[tb_members]
GO
DROP SYNONYM [dbo].[tb_medical_history_notes]
GO
DROP SYNONYM [dbo].[tb_icd9]
GO
DROP SYNONYM [dbo].[tb_groups]
GO
DROP SYNONYM [dbo].[tb_gop_medical_services]
GO
DROP SYNONYM [dbo].[tb_gop_estimates]
GO
DROP SYNONYM [dbo].[tb_floats]
GO
DROP SYNONYM [dbo].[tb_flag_sub_types]
GO
DROP SYNONYM [dbo].[tb_documents]
GO
DROP SYNONYM [dbo].[tb_document_categories]
GO
DROP SYNONYM [dbo].[tb_doctor_specialisation]
GO
DROP SYNONYM [dbo].[tb_customerservice]
GO
DROP SYNONYM [dbo].[tb_customer_service_types]
GO
DROP SYNONYM [dbo].[tb_currencies]
GO
DROP SYNONYM [dbo].[tb_cpt]
GO
DROP SYNONYM [dbo].[tb_countries]
GO
DROP SYNONYM [dbo].[tb_contacts]
GO
DROP SYNONYM [dbo].[tb_claims]
GO
DROP SYNONYM [dbo].[tb_claim_types]
GO
DROP SYNONYM [dbo].[tb_claim_status_history]
GO
DROP SYNONYM [dbo].[tb_claim_status]
GO
DROP SYNONYM [dbo].[tb_claim_notes]
GO
DROP SYNONYM [dbo].[tb_claim_diagnosis]
GO
DROP SYNONYM [dbo].[tb_banks]
GO
DROP SYNONYM [dbo].[tb_auditlogs]
GO
DROP SYNONYM [dbo].[tb_auditlog_types]
GO
DROP SYNONYM [dbo].[tb_addresses]
GO
DROP SYNONYM [dbo].[tb_address_types]
GO
DROP SYNONYM [dbo].[tb_actions]
GO
DROP SYNONYM [dbo].[tb_actionclass]
GO
DROP SYNONYM [dbo].[tb_accident_types]
GO
DROP SYNONYM [dbo].[ssp_service_detail_schedule]
GO
DROP SYNONYM [dbo].[ssp_service_detail_exclusions]
GO
DROP SYNONYM [dbo].[ssp_service_detail]
GO
DROP SYNONYM [dbo].[ssp_member_data]
GO
DROP SYNONYM [dbo].[ssp_invoice_m003]
GO
DROP SYNONYM [dbo].[ssp_invoice]
GO
DROP SYNONYM [dbo].[ssp_gop_gm01]
GO
DROP SYNONYM [dbo].[ssp_gop]
GO
DROP SYNONYM [dbo].[ssp_claim_member_info]
GO
DROP SYNONYM [dbo].[ssp_claim_diagnosis]
GO
DROP SYNONYM [dbo].[sp_validate_action]
GO
DROP SYNONYM [dbo].[fn_service_status]
GO
DROP SYNONYM [dbo].[fn_claim_status]
GO
DROP SYNONYM [dbo].[f_get_diagnosis_group_summary]
GO
CREATE SYNONYM [dbo].[f_get_diagnosis_group_summary] FOR [MEDICS40LDA].[dbo].[F_GET_DIAGNOSIS_GROUP_SUMMARY]
GO
CREATE SYNONYM [dbo].[fn_claim_status] FOR [MEDICS40LDA].[dbo].[F_CLAIM_STATUS]
GO
CREATE SYNONYM [dbo].[fn_service_status] FOR [MEDICS40LDA].[dbo].[F_INVOICE_STATUS]
GO
CREATE SYNONYM [dbo].[sp_validate_action] FOR [MEDICS40LDA].[dbo].[SP_VALIDATE_ACTION]
GO
CREATE SYNONYM [dbo].[ssp_claim_diagnosis] FOR [MEDICS40LDA].[dbo].[SP_CLAIMDIAGNOSIS]
GO
CREATE SYNONYM [dbo].[ssp_claim_member_info] FOR [MEDICS40LDA].[dbo].[SP_CLAIM_MEMBER_INFO]
GO
CREATE SYNONYM [dbo].[ssp_gop] FOR [MEDICS40LDA].[dbo].[SP_GOP]
GO
CREATE SYNONYM [dbo].[ssp_gop_gm01] FOR [MEDICS40LDA].[dbo].[SP_GOP_GM01]
GO
CREATE SYNONYM [dbo].[ssp_invoice] FOR [MEDICS40LDA].[dbo].[SP_INVOICE]
GO
CREATE SYNONYM [dbo].[ssp_invoice_m003] FOR [MEDICS40LDA].[dbo].[SP_INVOICE_M003]
GO
CREATE SYNONYM [dbo].[ssp_member_data] FOR [MEDICS40LDA].[dbo].[SP_MEMBER_DATA]
GO
CREATE SYNONYM [dbo].[ssp_service_detail] FOR [MEDICS40LDA].[dbo].[SP_SERVICE_DETAIL]
GO
CREATE SYNONYM [dbo].[ssp_service_detail_exclusions] FOR [MEDICS40LDA].[dbo].[SP_SERVICE_DETAIL_EXCLUSIONS]
GO
CREATE SYNONYM [dbo].[ssp_service_detail_schedule] FOR [MEDICS40LDA].[dbo].[SP_SERVICE_DETAIL_SCHEDULE]
GO
CREATE SYNONYM [dbo].[tb_accident_types] FOR [MEDICS40LDA].[dbo].[ACCIDENTTYPES]
GO
CREATE SYNONYM [dbo].[tb_actionclass] FOR [MEDICS40LDA].[dbo].[ACTIONCLASS]
GO
CREATE SYNONYM [dbo].[tb_actions] FOR [MEDICS40LDA].[dbo].[ACTIONS]
GO
CREATE SYNONYM [dbo].[tb_address_types] FOR [MEDICS40LDA].[dbo].[ADDRESSTYPES]
GO
CREATE SYNONYM [dbo].[tb_addresses] FOR [MEDICS40LDA].[dbo].[CLIENTADDR]
GO
CREATE SYNONYM [dbo].[tb_auditlog_types] FOR [MEDICS40LDA].[dbo].[AUDITLOGTYPES]
GO
CREATE SYNONYM [dbo].[tb_auditlogs] FOR [MEDICS40LDA].[dbo].[AUDITLOG]
GO
CREATE SYNONYM [dbo].[tb_banks] FOR [MEDICS40LDA].[dbo].[CLIENTBANK]
GO
CREATE SYNONYM [dbo].[tb_claim_diagnosis] FOR [MEDICS40LDA].[dbo].[CLAIMDIAGNOSIS]
GO
CREATE SYNONYM [dbo].[tb_claim_notes] FOR [MEDICS40LDA].[dbo].[CLMNOTES]
GO
CREATE SYNONYM [dbo].[tb_claim_status] FOR [MEDICS40LDA].[dbo].[F_CLAIM_STATUS()]
GO
CREATE SYNONYM [dbo].[tb_claim_status_history] FOR [MEDICS40LDA].[dbo].[CLMSTATUSHIST]
GO
CREATE SYNONYM [dbo].[tb_claim_types] FOR [MEDICS40LDA].[dbo].[CLAIMTYPES]
GO
CREATE SYNONYM [dbo].[tb_claims] FOR [MEDICS40LDA].[dbo].[CLAIMMAIN]
GO
CREATE SYNONYM [dbo].[tb_contacts] FOR [MEDICS40LDA].[dbo].[CLIENTCONT]
GO
CREATE SYNONYM [dbo].[tb_countries] FOR [MEDICS40LDA].[dbo].[COUNTRY]
GO
CREATE SYNONYM [dbo].[tb_cpt] FOR [MEDICS40LDA].[dbo].[CPT]
GO
CREATE SYNONYM [dbo].[tb_currencies] FOR [MEDICS40LDA].[dbo].[CURRENCY]
GO
CREATE SYNONYM [dbo].[tb_customer_service_types] FOR [MEDICS40LDA].[dbo].[CUSTSERVICETYPES]
GO
CREATE SYNONYM [dbo].[tb_customerservice] FOR [MEDICS40LDA].[dbo].[CUSTOMERSERVICE]
GO
CREATE SYNONYM [dbo].[tb_doctor_specialisation] FOR [MEDICS40LDA].[dbo].[DOCTYPE]
GO
CREATE SYNONYM [dbo].[tb_document_categories] FOR [MEDICS40LDA].[dbo].[DOCUMENTCATEGORIES]
GO
CREATE SYNONYM [dbo].[tb_documents] FOR [MEDICS40LDA].[dbo].[CLMLETTERS]
GO
CREATE SYNONYM [dbo].[tb_flag_sub_types] FOR [MEDICS40LDA].[dbo].[CLMFLGSUBTYPE]
GO
CREATE SYNONYM [dbo].[tb_floats] FOR [MEDICS40LDA].[dbo].[FLOATS]
GO
CREATE SYNONYM [dbo].[tb_gop_estimates] FOR [MEDICS40LDA].[dbo].[ESTIMATES]
GO
CREATE SYNONYM [dbo].[tb_gop_medical_services] FOR [MEDICS40LDA].[dbo].[CLMGOPTYPEMED]
GO
CREATE SYNONYM [dbo].[tb_groups] FOR [MEDICS40LDA].[dbo].[GROUPS]
GO
CREATE SYNONYM [dbo].[tb_icd9] FOR [MEDICS40LDA].[dbo].[ICD9]
GO
CREATE SYNONYM [dbo].[tb_medical_history_notes] FOR [MEDICS40LDA].[dbo].[MEDICAL_HISTORY_NOTES]
GO
CREATE SYNONYM [dbo].[tb_members] FOR [MEDICS40LDA].[dbo].[MEMBERS]
GO
CREATE SYNONYM [dbo].[tb_names] FOR [MEDICS40LDA].[dbo].[CLIENT]
GO
CREATE SYNONYM [dbo].[tb_nationality] FOR [MEDICS40LDA].[dbo].[NATIONALITY]
GO
CREATE SYNONYM [dbo].[tb_note_sub_types] FOR [MEDICS40LDA].[dbo].[NOTESUB]
GO
CREATE SYNONYM [dbo].[tb_note_types] FOR [MEDICS40LDA].[dbo].[NOTEMAIN]
GO
CREATE SYNONYM [dbo].[tb_plan_history] FOR [MEDICS40LDA].[dbo].[PLANHIST]
GO
CREATE SYNONYM [dbo].[tb_plans] FOR [MEDICS40LDA].[dbo].[PLANDEF]
GO
CREATE SYNONYM [dbo].[tb_policies] FOR [MEDICS40LDA].[dbo].[POLICY]
GO
CREATE SYNONYM [dbo].[tb_products] FOR [MEDICS40LDA].[dbo].[PRODUCTS]
GO
CREATE SYNONYM [dbo].[tb_provider_discount] FOR [MEDICS40LDA].[dbo].[PROVDISC]
GO
CREATE SYNONYM [dbo].[tb_schedule] FOR [MEDICS40LDA].[dbo].[SCHEDULE]
GO
CREATE SYNONYM [dbo].[tb_service_actions] FOR [MEDICS40LDA].[dbo].[CLMINVACTION]
GO
CREATE SYNONYM [dbo].[tb_service_status_history] FOR [MEDICS40LDA].[dbo].[CLMINVSTATHIST]
GO
CREATE SYNONYM [dbo].[tb_service_types] FOR [MEDICS40LDA].[dbo].[SERVICETYPES]
GO
CREATE SYNONYM [dbo].[tb_services] FOR [MEDICS40LDA].[dbo].[CLAIMH]
GO
CREATE SYNONYM [dbo].[tb_status_codes] FOR [MEDICS40LDA].[dbo].[REASONS]
GO
CREATE SYNONYM [dbo].[tb_sub_claim_types] FOR [MEDICS40LDA].[dbo].[SERVICETYPES]
GO
CREATE SYNONYM [dbo].[tb_sub_status_codes] FOR [MEDICS40LDA].[dbo].[REASONS]
GO
CREATE SYNONYM [dbo].[tb_usergroups] FOR [MEDICS40LDA].[dbo].[USERGROUPS]
GO
CREATE SYNONYM [dbo].[tb_users] FOR [MEDICS40LDA].[dbo].[USERS]
GO
CREATE SYNONYM [dbo].[vw_account_clients] FOR [MEDICS40LDA].[dbo].[V_ACCOUNT_CLIENTS]
GO
CREATE SYNONYM [dbo].[vw_case_history] FOR [MEDICS40LDA].[dbo].[V_CASE_HISTORY]
GO
CREATE SYNONYM [dbo].[vw_claim_status_history] FOR [MEDICS40LDA].[dbo].[V_CLAIM_STATUS_HIST]
GO
CREATE SYNONYM [dbo].[vw_member_search] FOR [MEDICS40LDA].[dbo].[V_MEMBERS_BROWSE]
GO
CREATE SYNONYM [dbo].[vw_task_manager] FOR [MEDICS40LDA].[dbo].[V_TASK_MANAGER]
GO
