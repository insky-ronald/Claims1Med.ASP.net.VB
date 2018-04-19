DROP view [dbo].[v_doctors]
GO

CREATE view [dbo].[v_doctors] as
select 
	c.id, 
	rtrim(c.account_code) as code, 
	c.spin_id,
	c.name, 
	c.full_name, 
	rtrim(s.specialisation_code) as specialisation_code, 
	rtrim(s.specialisation) as specialisation, 
	rtrim(c.home_country_code) as country_code, 
	rtrim(h.country) as country, 
	c.status_code, 
	c.blacklisted,
	--case when coalesce(d.discount_amount, 0) = 0 then d.discount_percent else d.discount_amount end as discount,
	isnull(d.discount_type_id, 0) as discount_type_id, 
	isnull(d.discount_amount, 0) as discount_amount, 
	isnull(d.discount_percent, 0) as discount_percent, 
	d.notes
from names c
left join doctor_specialisation s on c.doctor_type = s.specialisation_code
--left join addresses a on c.address_id = a.id
--left join countries t on a.country_code = t.code
left join countries h on c.home_country_code = h.code
left join provider_discount d on c.id = d.name_id
where c.name_type = 'D'and LEN(c.name) > 0
GO
