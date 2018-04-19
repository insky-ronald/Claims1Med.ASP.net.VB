DROP PROCEDURE [dbo].[GetMemberMedicalNotes]
GO

CREATE PROCEDURE [dbo].[GetMemberMedicalNotes]
/****************************************************************************************************
 Update History:
 ===============

 02-OCT-2017
****************************************************************************************************/
@id int,
@claim_id int = 0,
@visit_id bigint = 0
as
begin 
	SET NOCOUNT ON

	select 
		id,
		claim_id = @claim_id,
		medical_history_notes,
		getdate() as update_date,
		cast('' as varchar(10)) as update_user
	from members
	where id = @id
end
GO
