USE [MEDICS52]
GO

DROP VIEW [dbo].[client_case_fees]
GO

CREATE VIEW [dbo].[client_case_fees] as
select 
	c.CFEE_ID as id,
	c.OWNER_ID as client_id,
	c.CFEE_CODE as code,
	t.service_description as case_fee,
	c.IS_PERCENT as is_percent,
	c.CRCY_CODE as currency_code,
	c.CFEE_AMOUNT as amount,
	c.CFEE_PERCENT as percentage,
	c.InsertUser as create_user,
	c.InsertDate as create_date,
	c.UpdateUser as update_user,
	c.UpdateDate as update_date
from tb_client_case_fees c
left join case_fee_types t on t.code = c.CFEE_CODE


GO


