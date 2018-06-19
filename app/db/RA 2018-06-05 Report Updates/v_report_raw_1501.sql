USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_raw_1501]
GO

CREATE VIEW [dbo].[v_report_raw_1501] AS
select
	s.id,
	m.certificate_no as certificate_id,
	s.status_user as user_name,
	c.client_id,
	s.status_date,
	s.service_date as incident_date,
	s.invoice_received_date as notification_date
from services s
join claims c on s.claim_id = c.id and c.is_deleted = 0
join members m on c.member_id = m.id
where s.service_type = 'INV' and s.is_deleted = 0
GO