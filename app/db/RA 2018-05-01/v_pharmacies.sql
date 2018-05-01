USE [MEDICS52]
GO

/****** Object:  View [dbo].[v_clinics]    Script Date: 5/1/2018 3:56:54 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[v_pharmacies] as
select 
	c.id, 
	rtrim(c.account_code) as code, 
	c.spin_id,
	c.name, 
	rtrim(c.home_country_code) as home_country_code, 
	rtrim(h.country) as country, 
	c.status_code, 
	c.blacklisted,
	--case when coalesce(d.discount_amount, 0) = 0 then d.discount_percent else d.discount_amount end as discount,
	d.discount_type_id, 
	d.discount_amount, 
	d.discount_percent, 
	d.notes
from names c
left join provider_discount d on c.id = d.name_id
--left join doctor_specialisation s on c.doctor_type = s.specialisation_code
--left join addresses a on c.address_id = a.id
--left join countries t on a.country_code = t.code
left join countries h on c.home_country_code = h.code
where c.name_type = 'PHA'and LEN(c.name) > 0


GO


