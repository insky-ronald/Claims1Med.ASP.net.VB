DROP PROCEDURE [dbo].[GetClaimNotes]
GO

CREATE PROCEDURE [dbo].[GetClaimNotes]
-- ***************************************************************************************************
-- Last modified on
-- 04-OCT-2017
-- *************************************************************************************************** 
@id int = 0, 
@type as char(1) = '',
@claim_id as int = 0,
@service_id as int = 0,
@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
@sort as varchar(100) = 'reference_no',
@order varchar(10) = 'asc',
@visit_id as bigint = 0
as
begin
	set nocount on

	IF @action in (10,20,50)
	BEGIN
		SELECT
			*
		FROM claim_notes
		WHERE id = @id
	END ELSE
	BEGIN
		declare @query nvarchar(1024)

		set @query = 	N'select * from v_claim_notes'

		if @type is NULL 
		begin
			set @query = @query + N' where [id] = 0'
			exec sp_executesql @query
		end else if @type = 'C' /* return all notes in claim  */
		begin
			set @id = @claim_id
			set @query = @query + N' where [claim_id] = @P1'-- and n.INVOICE_ID = 0'
		end else if @type = 'S' /* return all notes in serivce  */
		begin
			set @id = @service_id
			set @query = @query + N' where [service_id] = @P1'
		end
	
		set @query = @query +' order by ' + @sort +' '+ @order

		exec sp_executesql @query, N'@P1 int', @id
	END
end
GO

