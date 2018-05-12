DROP VIEW schedule_history
GO

CREATE VIEW schedule_history
AS
	SELECT
		PLAN_ID as id, 
		PREV_ID as previous_id, 
		PLAN_CODE as plan_code, 
		START_DATE as start_date, 
		END_DATE as end_date, 
		IS_CURRENT as is_current, 
		--MAX_LIMIT_LIFE as , 
		--DEDUCT_EMP as , 
		--DEDUCT_FAM as , 
		--OUTPOCKET_EMP as , 
		--OUTPOCKET_FAM as , 
		InsertDate as create_date, 
		InsertUser as create_user, 
		UpdateDate as update_date, 
		UpdateUser as update_user
	FROM tb_schedule_history