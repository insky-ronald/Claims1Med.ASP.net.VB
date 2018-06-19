USE [MEDICS52]
GO

ALTER VIEW [dbo].[v_report_raw_2003] AS
SELECT
	s.id,
	c.claim_no,
	s.service_no,
	c.client_id,
	p.policy_no,
	s.start_date as treatment_date,
	s.status_code as status,
	s.service_sub_type as claim_sub_type,
	s.provider_id,
	s.doctor_id as physician_id
FROM services s
JOIN claims c on s.claim_id = c.id
JOIN policies p on c.policy_id = p.id
join members m on c.member_id = m.id
--join names n on c.client_id = n.id
--join clients cl on c.client_id = cl.id
--left outer join icd on s.diagnosis_code = icd.code

GO


