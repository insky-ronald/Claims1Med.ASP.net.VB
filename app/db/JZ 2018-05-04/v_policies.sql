ALTER view [dbo].[v_policies] as
SELECT p.*,
       r.product_name,
	   r.client_name,
	   h.name as policy_holder
FROM policies p
left join v_products r on r.code = p.product_code
left join names h on h.id = p.name_id
where coalesce(p.policy_no, '') <> ''


GO


