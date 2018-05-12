DROP VIEW [dbo].[limits]
GO

CREATE VIEW [dbo].[limits]
AS
	SELECT        
		LIMIT_ID as id, 
		SCHED_ID as schedule_id, 
		SEQ_NO as sequence_no, 
		--PLAN_CODE as , 
		--BEN_CODE as , 
		RULE_ID as rule_code, 
		--IS_DISABILITY as , 
		--NO_LIMIT as , 
		--NOT_COVERED as , 
		MAX_UNITS as max_units, 
		MAX_AMOUNT as max_amount, 
		MAX_FAMILY as max_family, 
		MAX_PERCENT as max_percent, 
		DEDUCTIBLE as deductible, 
		UNIT_SPEC as unit_specification, 
		PERIOD_COUNT as year_count, 
		InsertUser as create_user, 
		InsertDate as create_date, 
		UpdateUser as update_user, 
		UpdateDate as update_date
	FROM dbo.tb_limits

GO
