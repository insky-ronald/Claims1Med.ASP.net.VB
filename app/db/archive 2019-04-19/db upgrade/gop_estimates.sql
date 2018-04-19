DROP VIEW [dbo].[gop_estimates]
GO

CREATE VIEW [dbo].[gop_estimates]
as
	SELECT 
		INVOICE_ID as id,
		average_cost,
		average_los,
		estimated_cost,
		estimated_los,
		estimated_provider_cost,
		estimated_provider_los,
		InsertUser AS create_user,
		InsertDate AS create_date,
		UpdateUser AS update_user,
		UpdateDate AS update_date
	  FROM tb_gop_estimates
GO
