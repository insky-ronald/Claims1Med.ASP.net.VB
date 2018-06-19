USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_raw_2004]
GO

CREATE VIEW [dbo].[v_report_raw_2004] AS
SELECT
	s.id,
	c.claim_no,
	s.service_no,
	s.invoice_no as service_id,
	c.client_id,
	p.policy_no,
	c.create_date as case_opened,
	s.service_date as incident_date,
	s.status_code as status,
	s.claim_type as claim_type,
	s.provider_id,
	s.doctor_id as physician_id
FROM services s
JOIN claims c on s.claim_id = c.id
JOIN policies p on c.policy_id = p.id
--join members m on c.member_id = m.id
WHERE s.is_deleted = 0 and s.claim_type <> 'CSV'

GO