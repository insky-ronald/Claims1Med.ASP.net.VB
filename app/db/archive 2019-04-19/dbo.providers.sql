USE [MEDICS50]
GO

/****** Object:  View [dbo].[providers]    Script Date: 6/27/2017 2:28:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





CREATE view [dbo].[providers] as
select c.id, c.name_type as provider_type, c.sun_code as code, c.full_name as name, a.street, a.city, a.province, a.zip_code, t.country
from clients c
left join addresses a on c.address_id = a.id
left join countries t on a.country_code = t.code
where c.name_type in ('H', 'K', 'D') and rtrim(coalesce(c.full_name, '')) <> ''





GO

