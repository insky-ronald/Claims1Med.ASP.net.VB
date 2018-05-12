DROP VIEW [dbo].[schedule]
GO

CREATE VIEW [dbo].[schedule]
AS
	SELECT        
		RULE_ID as code, 
		RULE_NAME as rule_name, 
		notes,
		ACTIVE as is_active,
		InsertUser as create_user, 
		InsertDate as create_date, 
		UpdateUser as update_user, 
		UpdateDate as update_date
	FROM dbo.tb_validation_rules

GO
