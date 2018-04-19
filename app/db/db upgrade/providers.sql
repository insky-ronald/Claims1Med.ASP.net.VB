DROP view [dbo].[providers]
GO

CREATE view [dbo].[providers] as
select 
	c.id, 
	c.name_type as provider_type, 
	rtrim(c.account_code) as code, 
	c.spin_id,
	c.name, 
	c.full_name, 
	rtrim(s.specialisation_code) as specialisation_code, 
	rtrim(s.specialisation) as specialisation, 
	rtrim(c.home_country_code) as home_country_code, 
	rtrim(h.country) as home_country, 
	c.status_code, 
	c.blacklisted
	--a.street, 
	--a.city, 
	--a.province, 
	--a.zip_code, 
	--t.country, 
	--case when coalesce(d.discount_amount, 0) = 0 then d.discount_percent else d.discount_amount end as discount,
	--d.discount_type_id, d.discount_amount, d.discount_percent, d.notes
from names c
left join doctor_specialisation s on c.doctor_type = s.specialisation_code
left join addresses a on c.address_id = a.id
left join countries t on a.country_code = t.code
left join countries h on c.home_country_code = h.code
left join provider_discount d on c.id = d.name_id
where c.name_type in ('H', 'K', 'D', 'PHA', 'A', 'CRC') and rtrim(coalesce(c.name, '')) <> '' and rtrim(coalesce(c.name, '')) <> '-'
GO
