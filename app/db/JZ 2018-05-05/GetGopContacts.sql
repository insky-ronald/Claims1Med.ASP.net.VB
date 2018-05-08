DROP PROCEDURE [dbo].[GetGopContacts]
GO

CREATE PROCEDURE [dbo].[GetGopContacts]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@provider_id int = 0,
	@doctor_id int = 0,
	@is_hospital int = 1,
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	declare @contacts table (
		id int,
		name varchar(100),
		fax varchar(20)
	)

	insert into @contacts (
		id,
		name,
		fax
	) select 
		id,
		full_name,
		fax
	from contacts
	where name_id = @provider_id

	SELECT * FROM @contacts ORDER BY name
END
GO
