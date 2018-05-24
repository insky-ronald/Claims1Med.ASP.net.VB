USE [MEDICS52SYS]
GO

/****** Object:  View [dbo].[v_actions]    Script Date: 5/17/2018 3:18:05 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [dbo].[v_actions]
AS
	SELECT 
		[application_id]
		,[id]
		,[parent_id]
		,[position]
		,[code]
		,[action] as action_name
		,[description]
		,[action_type_id]
		,[status_code_id]
		,[insert_visit_id]
		,[inserted_at]
		,[update_visit_id]
		,[updated_at]
	FROM [dbo].[actions]

GO


