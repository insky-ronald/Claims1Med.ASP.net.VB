DROP VIEW [dbo].[plan_history]
GO

CREATE VIEW [dbo].[plan_history]
AS
	SELECT        
		HIST_ID AS id, 
		IP_ID AS member_id, 
		SEQ_NO AS sequence_no, 
		HIST_TYPE AS history_type, 
		PLAN_CODE AS plan_code, 
		STATUS AS status_code, 
		EFF_DATE AS start_date, 
		END_DATE AS end_date, 
		START_DATE as rcd,
		CANCEL_DATE AS cancelation_date, 
		REINSTATE_DATE AS reinstatement_date, 
		EXTEND_DATE AS extension_date, 
		RENEW_DATE AS renewal_date, 
		MEMO AS notes, 
		vip_flag, 
		blackllist_flag, 
		prorate_amount, 
		emergency_amount, 
		wait_period_days, 
		wait_period_months, 
		wait_period_start_date, 
		AIA_POL_STATUS as flag,
		AIA_PLAN_NAME as sub_product,
		InsertDate AS create_date, 
		InsertUser AS create_user, 
		UpdateDate AS update_date, 
		UpdateUser AS update_user
	FROM dbo.tb_plan_history


GO
