DROP VIEW [dbo].[v_claim_documents]
GO

CREATE VIEW [dbo].[v_claim_documents]
as
	select 
		n.*,
        dbo.f_document_categories(N.id) as document_categories,
		service_type = cast(case when n.service_id = 0 then 'CLM' else s.service_type end as char(3)),
		service_name = ISNULL(m.module_name, 'Claim'),
		reference_no = cast(case when n.service_id = 0 then c.claim_no else s.service_no end as varchar(22)),
		invoice_no = cast(case when n.service_id = 0 then 'Claim' else s.invoice_no end as varchar(15)),
		s.invoice_date,
		sequence_no = cast(case when n.service_id = 0 then 0 else s.sequence_no end as tinyint),
		ds.description as status,
		src.description as source_name,
		ISNULL(u1.name, n.create_user) as create_user_name,
		ISNULL(u1.name, n.update_user) as update_user_name
	from claim_documents n
		join claims c on n.claim_id = c.id
		left outer join services s on n.service_id = s.id
		left join f_modules() m on s.service_type = m.module_id
		left outer join f_document_source() src on n.source = src.code
		left outer join f_document_status() ds on n.action_code = ds.code
		left outer join users u1 on n.create_user = u1.user_name
		left outer join users u2 on n.update_user = u2.user_name
GO
