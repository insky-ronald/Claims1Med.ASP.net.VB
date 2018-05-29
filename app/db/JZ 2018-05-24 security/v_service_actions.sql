USE [MEDICS52]
GO

/****** Object:  View [dbo].[v_service_actions]    Script Date: 5/25/2018 4:06:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [dbo].[v_service_actions]
AS
	SELECT  
		c.*,
		ac.action_type,
		a.action_name,
		u1.name as action_owner_name,
		u2.name as create_user_name,
		u3.name as completion_user_name,
		u4.name as update_user_name
	FROM dbo.service_actions c
	LEFT JOIN users u1 on c.action_owner = u1.user_name
	LEFT JOIN users u2 on c.create_user = u2.user_name
	LEFT JOIN users u3 on c.completion_user = u3.user_name
	LEFT JOIN users u4 on c.update_user = u4.user_name
	LEFT OUTER JOIN dbo.action_types ac ON c.action_type_code = ac.code
	LEFT OUTER JOIN dbo.ACTIONS a ON C.action_type_code = a.action_type AND c.action_code = a.code



GO


