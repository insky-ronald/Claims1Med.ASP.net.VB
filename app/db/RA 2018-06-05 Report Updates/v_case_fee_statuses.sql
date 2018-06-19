USE [MEDICS52]
GO

DROP VIEW [dbo].[v_case_fee_statuses] 
GO

CREATE VIEW [dbo].[v_case_fee_statuses] 
AS
	select distinct(main_status) as status, 
		status_code 
	from v_service_status_codes
	where service_type = 'CAS'


GO


