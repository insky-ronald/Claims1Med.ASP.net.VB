DROP VIEW [dbo].[service_details]
GO

CREATE VIEW [dbo].[service_details]
AS
	SELECT        
		CLAIM_ID as id, 
		CLAIM_NO as claim_id, 
		INVOICE_ID as service_id, 
		SCHED_ID as schedule_id, 
		SCHED_ID2 as schedule_id2, 
		SEQ_NO as sequence_no, 
		BEN_CODE as benefit_code, 
		ICD_CODE as diagnosis_code, 
		CPT_CODE as procedure_code, 
		ROOM_TYPE as room_type, 
		--DOCTOR as , 
		EST_DAYS as estimate_units, 
		UNITS as units, 
		UNITS_DEC as units_declined, 
		UNITS_APP as units_approved, 
		--UNITS_MAJ as , 
		ESTIMATE as estimate, 
		CLM_AMOUNT as actual_amount, 
		DISC_PER as discount_percent, 
		DISC_AMOUNT as discount_amount, 
		DEC_AMOUNT as declined_amount, 
		APP_AMOUNT as approved_amount, 
		EX_GRATIA as ex_gratia, 
		PAYABLE as payable, 
		PAID as paid, 
		--MAJ_AMOUNT as , 
		DEDUCTIBLE as deductible, 
		--CO_INSURE as , 
		--CO_PAYMENT as , 
		--MEDICARE as , 
		--IS_EXGRATIA as , 
		IS_NOVALIDATE as is_novalidate, 
		IS_SYS_VALIDATED as is_sys_validated, 
		IS_EXCLUSION as is_exclusion, 
		IS_RECOVER as is_recover, 
		IS_SPLIT as is_split, 
		PRORATE as prorate, 
		--GOP_ITEM_NAME as , 
		STATUS as status_code, 
		STATUS_CODE as sub_status_code, 
		STATUS_DATE as status_date, 
		STATUS_USER as status_user_name, 
		APPV_DATE as approved_date, 
		APPV_USER as approved_user, 
		AUTH_DATE as authorised_date, 
		AUTH_USER as authorised_user, 
		PAYMENT_ID as payment_id, 
		MEMO as message, 
		REMARKS as remarks, 
		InsertDate as create_date, 
		InsertUser as create_user, 
		UpdateDate as update_date, 
		UpdateUser as update_user
	FROM dbo.tb_claim




GO


