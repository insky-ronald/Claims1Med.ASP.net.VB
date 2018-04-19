DROP VIEW [dbo].[v_claims]
GO

CREATE VIEW [dbo].[v_claims]
-- ****************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- ****************************************************************************************************
as
	select  
		c.id,
		c.claim_no,
		c.member_id,
		c.claim_type,
		c.notification_date,
		c.status_code,
		cs.STATUS_DESC as status,
		--condition = cast(dbo.f_get_diagnosis_group_summary(c.id) as varchar(max)),
		diagnosis = cast(dbo.f_get_diagnosis_groups(c.id) as varchar(max))
	from claims c
	left outer join dbo.fn_claim_status() cs on c.status_code = cs.STATUS_CODE
	where c.is_deleted = 0 and c.claim_type <> 'CSV'
	-- and c.member_id = 3114612
GO


