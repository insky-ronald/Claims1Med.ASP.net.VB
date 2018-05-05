DROP PROCEDURE [dbo].[GetNewMemberInfo]
GO

CREATE PROCEDURE [dbo].[GetNewMemberInfo]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@plan_code as varchar(15) = '',
	@member_id as int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_id AS int

	SELECT
		@user_id = user_id
	FROM visits
	WHERE id = @visit_id

	SELECT
		p.code as plan_code,
		p.plan_name,
		p.product_code,
		p.product_name,
		p.client_id,
		p.client_name,
		cast('XX' as char(2)) as relationship_code,
		cast('AGO' as char(3)) as home_country_code,
		start_date = 
		u.user_name,
		u.name as user_full_name
	FROM v_plans p
	JOIN v_policies pl on p.product_code = pl.product_code
	,users u
	WHERE p.code = @plan_code 
	AND u.id = @user_id 
	AND pl.id in (select id from v_valid_policies)
END
GO
