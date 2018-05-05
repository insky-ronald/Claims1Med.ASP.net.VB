ALTER VIEW [dbo].[plans]
AS
	SELECT        
		rtrim(PLAN_CODE) AS code,
		rtrim(PROD_CODE) AS product_code,
		PLAN_DESC AS plan_name,
		rtrim(PLAN_TYPE) AS plan_type,
		CRCY_CODE AS currency_code,
		STATUS as status_id,
		InsertUser AS create_user,
		InsertDate AS create_date,
		UpdateUser AS update_user,
		UpdateDate AS update_date
	FROM dbo.tb_plans



GO


