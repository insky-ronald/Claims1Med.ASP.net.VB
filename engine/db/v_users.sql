DROP VIEW [dbo].[v_users]
GO

CREATE VIEW [dbo].[v_users]
AS
    select
		ud.id,
		u.user_name,
		ud.organisation_id,
		full_name = LTRIM(CASE WHEN ISNULL(ud.last_name, '') = '' THEN '' ELSE ud.last_name +', ' END + 
					CASE WHEN ISNULL(ud.first_name, '') = '' THEN '' ELSE ud.first_name +' ' END + 
					ISNULL(ud.middle_name, '')),
		ud.last_name,
		ud.middle_name,
		ud.first_name,
		ud.gender,
		ud.dob,
		ud.email,
		ud.status_code_id
		--ISNULL(dbo.f_user_roles(ud.id), '') as roles,
		--ISNULL(dbo.f_user_role_names(ud.id), '') as role_names
	from dbo.users ud
	left outer join user_login_info u on ud.id = u.id


GO


