DROP VIEW [dbo].[v_claim_notes]
GO

CREATE VIEW [dbo].[v_claim_notes]
-- ***************************************************************************************************
-- Last modified on
-- 04-OCT-2017
-- *************************************************************************************************** 
AS
	select 
		n.*,
		case when ISNULL(n.service_id, 0) = 0 then 'CLM' else s.service_type end as module_id,
		case when ISNULL(n.service_id, 0) = 0 then c.claim_no else s.service_no end as reference_no,
		nt.note_type as note_type_name,
		nst.note_sub_type as note_sub_type_name,
		ISNULL(u1.name, n.create_user) as create_user_name,
		ISNULL(u2.name, n.update_user) as update_user_name,
		cast(0 as bit) as is_new
	from claim_notes n
		join claims c on n.claim_id = c.id
		left outer join services s on n.service_id = s.id
		join note_types nt on n.note_type = nt.code
		join note_sub_types nst on n.note_sub_type = nst.code
		left outer join users u1 on n.create_user = u1.user_name
		left outer join users u2 on n.update_user = u2.user_name
		--join NOTEMAIN nm on n.NOTE_CODE = nm.NOTE_CODE
		--join NOTESUB ns on n.NOTE_CODE = ns.NOTE_CODE and n.SUB_CODE = ns.SUB_CODE

GO

