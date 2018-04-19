DROP PROCEDURE [dbo].[GetMemberPlanHistory]
GO

CREATE PROCEDURE [dbo].[GetMemberPlanHistory]
/****************************************************************************************************
 Update History:
 ===============

 03-OCT-2017
****************************************************************************************************/
@member_id int,
@visit_id bigint = 0
as
begin 
	SET NOCOUNT ON

	select 
		h.*,
		ISNULL(u1.name, h.create_user) as create_user_name,
		ISNULL(u2.name, h.update_user) as update_user_name
	from plan_history h
	left outer join users u1 on h.create_user = u1.user_name
	left outer join users u2 on h.update_user = u2.user_name
	where member_id = @member_id
end
GO
