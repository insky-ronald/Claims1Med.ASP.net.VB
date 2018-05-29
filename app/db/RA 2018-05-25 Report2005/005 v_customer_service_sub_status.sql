USE [MEDICS52]
GO

DROP VIEW [dbo].[v_customer_service_sub_status]
GO

create view [dbo].[v_customer_service_sub_status] as
select 
	sub_status_code,
	sub_status
from sub_status_codes 
where service_type = 'CSV'

GO


