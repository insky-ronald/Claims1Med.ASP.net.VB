USE [MEDICS52SYS]
GO

/****** Object:  View [dbo].[v_users]    Script Date: 5/15/2018 10:45:33 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [dbo].[v_users]
AS
    select
		ud.id,
		u.user_name,
		ud.organisation_id,
		full_name = LTRIM(CASE WHEN ISNULL(ud.last_name, '') = '' THEN '' ELSE ud.last_name END + 
					CASE WHEN ISNULL(ud.first_name, '') = '' THEN '' ELSE ', '+ ud.first_name END + 
					CASE WHEN ISNULL(ud.middle_name, '') = '' THEN '' ELSE ' '+ ud.middle_name END),
		ud.last_name,
		ud.middle_name,
		ud.first_name,
		ud.gender,
		ud.dob,
		ut.designation,
		ud.email,
		ut.phone_no,
		ud.status_code_id
	from dbo.users ud
	left outer join tb_users ut on ud.id = ut.id
	left outer join user_login_info u on ud.id = u.id



GO


