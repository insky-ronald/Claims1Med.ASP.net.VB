USE [MEDICS52]
GO

DROP VIEW [dbo].[v_report_raw_2005]
GO

CREATE VIEW [dbo].[v_report_raw_2005] AS
SELECT
	cn.id,
	c.claim_no as reference_no,
	cs.service_type,
	s.sub_status_code as status_code,
	cs.InsertDate as call_date,
	nt.note_type as note_category,
	nst.note_sub_type as note_sub_category,
	cn.create_date as note_insert_date,
	c.client_id,
	clts.full_name as member_name
FROM tb_customerservice cs
JOIN claim_notes cn on cs.INVOICE_ID = cn.service_id
JOIN note_types nt on cn.note_type = nt.code
JOIN note_sub_types nst on cn.note_type = nst.note_type and cn.note_sub_type = nst.code
JOIN services s on cs.INVOICE_ID = s.id
JOIN claims c on s.claim_id = c.id
JOIN clients cl on c.client_id = cl.id
JOIN members m on c.member_id = m.id
JOIN clients clts on c.name_id = clts.id
JOIN customer_service_types cst on cs.SERVICE_TYPE = cst.code
JOIN tb_status_codes r on s.service_type = r.MODULE_ID and s.sub_status_code = r.RES_CODE

GO
