DROP PROCEDURE [dbo].[GetNewMemberInfo]
GO

CREATE PROCEDURE [dbo].[GetNewMemberInfo]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@certificate_id as int = 0,
	@relationship_code char(2) = '',
	@plan_code as varchar(15) = '',
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

	IF @certificate_id = 0
		SELECT
			cast('' as varchar(20)) as certificate_no,
			p.code as plan_code,
			p.plan_name,
			p.product_code,
			p.product_name,
			p.client_id,
			p.client_name,
			cast('SELF' as varchar(100)) as main_member,
			pl.start_date as start_date,
			pl.end_date as end_date,
			pl.id as policy_id,
			pl.policy_no,
			pl.policy_holder,
			pl.issue_date as policy_issue_date,
			pl.start_date as policy_start_date,
			pl.end_date as policy_end_date,
			cast(0 as int) as dependent_code,
			cast('' as char(1)) as gender,
			cast('XX' as char(2)) as relationship_code,
			cast('AGO' as char(3)) as home_country_code,
			cast('117117' as varchar(10)) as nationality_code,
			u.user_name,
			u.name as user_full_name
		FROM v_plans p
		JOIN v_policies pl on p.product_code = pl.product_code
		,users u
		WHERE p.code = @plan_code 
		AND u.id = @user_id 
		AND pl.id in (select id from v_valid_policies)
	ELSE
		SELECT
			m.certificate_no as certificate_no,
			p.code as plan_code,
			p.plan_name,
			p.product_code,
			p.product_name,
			p.client_id,
			p.client_name,
			mm.name as main_member,
			m.start_date as start_date,
			m.end_date as end_date,
			pl.id as policy_id,
			pl.policy_no,
			pl.policy_holder,
			pl.issue_date as policy_issue_date,
			pl.start_date as policy_start_date,
			pl.end_date as policy_end_date,
			cast(0 as int) as dependent_code,
			r.sex as gender,
			@relationship_code as relationship_code,
			n.home_country_code,
			n.nationality_code,
			u.user_name,
			u.name as user_full_name
		FROM members m
		JOIN names n on m.name_id = n.id
		JOIN names mm on m.certificate_id = mm.id
		JOIN v_plans p on m.plan_code = p.code
		JOIN v_policies pl on p.product_code = pl.product_code
		,users u, relationships r
		WHERE m.certificate_id = @certificate_id and m.dependent_code = 0 --and p.code = @plan_code 
		AND u.id = @user_id AND r.code = @relationship_code
		AND pl.id in (select id from v_valid_policies)
END
GO
