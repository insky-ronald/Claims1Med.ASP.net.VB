USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_raw_1503]
GO

CREATE VIEW [dbo].[v_report_raw_1503] AS
select
	s.id,
	m.certificate_no as certificate_id,
	s.status_user as user_name,
	c.client_id,
	s.status_code as invoice_status_code,
	s.sub_status_code as invoice_sub_status_code,
	status_date = cast(convert(char(11), s.status_date, 100) as datetime),
	s.service_date as incident_date,
	c.notification_date
from services s
join claims c on s.claim_id = c.id and c.is_deleted = 0
join members m on c.member_id = m.id
where s.service_type = 'CAS' and s.is_deleted = 0
GO

