ALTER PROCEDURE [dbo].[GetNewClaimInfo]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@claim_type as char(4) = '',
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

	--IF @user_id = 1
		--SET @user_id = 102 -- JZ account

	SELECT
		t.claim_type,
		u.user_name,
		u.name as user_full_name,
		notification_date = getdate(),
		country_of_incident = CAST('AGO' as char(3)), -- default for LDA
		CAST('AON' as char(3)) as base_currency_code,
		c.currency_code as client_currency_code,
		pl.currency_code as eligibility_currency_code
	FROM members m
	JOIN clients c on m.client_id = c.id
	JOIN plans pl on m.plan_code = pl.code
	,v_claim_types t, users u
	WHERE m.id = @member_id AND t.code = @claim_type AND u.id = @user_id
END
