DROP function [dbo].[f_document_source]
GO

CREATE function [dbo].[f_document_source] ( )
/****************************************************************************************************
 Update History:
 ===============
 10-JAN-2014 JZ: Ticket 835733
****************************************************************************************************/
returns @source table (
	code char(3),
	description varchar(30)
)
as
begin
	insert into @source(CODE, DESCRIPTION) values('EML', 'Incoming Email')
	insert into @source(CODE, DESCRIPTION) values('FAX', 'Incoming Fax')
	insert into @source(CODE, DESCRIPTION) values('INT', 'Internal Document') 
   	return
end
GO
