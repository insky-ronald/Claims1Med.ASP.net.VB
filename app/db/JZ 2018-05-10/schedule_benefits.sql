DROP VIEW [dbo].[schedule_benefits]
GO

CREATE VIEW [dbo].[schedule_benefits]
AS
	SELECT        
		SCHED_ID as schedule_id, 
		BEN_CODE as benefit_code, 
		InsertUser as create_user, 
		InsertDate as create_date, 
		UpdateUser as update_user, 
		UpdateDate as update_date
	FROM dbo.tb_schedule_benefits

GO
