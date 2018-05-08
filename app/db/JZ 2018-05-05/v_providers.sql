DROP VIEW [dbo].[v_providers]
GO

CREATE VIEW [dbo].[v_providers]
AS
	select 
		p.id,
		cast(0 as int) as client_id,
		p.provider_type,
		nt.name_type as provider_type_name,
		p.code,
		p.name,
		p.spin_id,
		p.home_country_code,
		p.home_country,
		cast('A' as char(1)) as network_status_code,
		p.status_code,
		p.blacklisted,
		cast(0 as int) as category
	from providers p
	join name_types nt on p.provider_type = nt.code
go
