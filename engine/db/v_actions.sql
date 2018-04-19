DROP VIEW [dbo].[v_actions]
GO

CREATE VIEW [dbo].[v_actions]
AS
	SELECT 
		[id]
		,[code]
		,[action] as action_name
		,[description]
		,[action_type_id]
		,[application_id]
		,[position]
		,[status_code_id]
		,[insert_visit_id]
		,[inserted_at]
		,[update_visit_id]
		,[updated_at]
	FROM [dbo].[actions]
GO
