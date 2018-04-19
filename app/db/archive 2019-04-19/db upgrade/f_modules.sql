DROP FUNCTION [dbo].[f_modules]
GO

CREATE FUNCTION [dbo].[f_modules] ( )
-- ***************************************************************************************************
-- Last modified on
-- 06-OCT-2017
-- *************************************************************************************************** 
returns @modules table (
	seq_no tinyint,
	module_id char(3),
	module_name varchar(30)
)
as
begin
	insert into @modules(seq_no, module_id, module_name) values(0, 'CLM', 'Claim');
	insert into @modules(seq_no, module_id, module_name) values(1, 'INV', 'Invoice');
	insert into @modules(seq_no, module_id, module_name) values(2, 'NOC', 'Notification of Claim');
	insert into @modules(seq_no, module_id, module_name) values(3, 'GOP', 'Guarantee of Payment');
	insert into @modules(seq_no, module_id, module_name) values(4, 'REC', 'Recovery');
	insert into @modules(seq_no, module_id, module_name) values(5, 'CAS', 'Case Fee');
	insert into @modules(seq_no, module_id, module_name) values(6, 'COS', 'Cost Containment');
	insert into @modules(seq_no, module_id, module_name) values(7, 'CSV', 'Customer Service');
	insert into @modules(seq_no, module_id, module_name) values(8, 'FLG', 'Flags');

   	return
end
GO
