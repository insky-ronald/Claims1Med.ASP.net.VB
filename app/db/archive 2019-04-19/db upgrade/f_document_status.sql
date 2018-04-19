DROP function [dbo].[f_document_status]
GO

CREATE function [dbo].[f_document_status] ( )
returns @status table (
	code char(1),
	description varchar(30)
)
as
begin
	insert into @status(CODE, DESCRIPTION) values('P', 'Print')	-- Outbox
	insert into @status(CODE, DESCRIPTION) values('F', 'Fax') -- Outbox
	insert into @status(CODE, DESCRIPTION) values('E', 'Email') -- Outbox
	insert into @status(CODE, DESCRIPTION) values('D', 'Draft') -- Outbox

	insert into @status(CODE, DESCRIPTION) values('V', 'Attached Here') -- Inbox
	insert into @status(CODE, DESCRIPTION) values('M', 'Attached from Document Manager') -- Inbox
	insert into @status(CODE, DESCRIPTION) values('X', 'Deleted') -- Inbox/Outbox
   	return
end
GO
