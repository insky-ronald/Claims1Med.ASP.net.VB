DROP VIEW [dbo].[v_providers_by_client]
GO

CREATE VIEW [dbo].[v_providers_by_client]
AS
	SELECT
	    p.COMP_ID as id, 
    	p.OWNER_ID as client_id,
	    p.COMP_TYPE as provider_type, 
		nt.name_type as provider_type_name,
	    p.ACCT_CODE as code, 
	    p.COMP_NAME as name, 
	    --ADDRESS_ID,
	    --CONTACT_ID,           
	    p.SPIN_ID as spin_id,
        --p.DISCOUNT as discount,
		--p.DISC_TYPE as discount_type,
        --NOTES,
        --DOC_TYPE,
		p.HOME_CTRY as home_country_code,
		ctry.country as home_country,
        p.STATUS as network_status_code,
        p.PROV_TYPE as status_code,
		p.IS_BLACKLISTED as blacklisted,
		--PROVIDER_NOTES,
		--UpdateDate, 
	    --UpdateUser,
	    --InsertDate,
	    --InsertUser,        
		--p.specialisation,
		--CTRY_NAME,
		p.category
	FROM vw_account_providers_by_client p
	join name_types nt on p.COMP_TYPE = Nt.code
	left outer join countries ctry on p.HOME_CTRY = ctry.code