DROP VIEW [dbo].[benefits]
GO

CREATE VIEW [dbo].[benefits]
AS
	SELECT        
		BEN_CODE as code, 
		BEN_DESC as benefit,
		UNITS_REQD as units_required,
		InsertUser as create_user, 
		InsertDate as create_date, 
		UpdateUser as update_user, 
		UpdateDate as update_date
	FROM dbo.tb_benefits

GO
