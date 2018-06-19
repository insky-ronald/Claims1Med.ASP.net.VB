USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_raw_1502]
GO

CREATE VIEW [dbo].[v_report_raw_1502] AS
select
	c.CLAIM_ID as id,
	m.certificate_no as certificate_id,
	s.status_user as user_name,
	l.client_id,
	s.status_date,
	s.service_date as incident_date,
	s.invoice_received_date as notification_date
from tb_claim c
join services s on c.INVOICE_ID = s.id and s.service_type = 'INV' and s.is_deleted = 0
join tb_claims l on c.CLAIM_NO = l.CLAIM_NO and l.IsDeleted = 0
join members m on l.IP_ID = m.id 

GO