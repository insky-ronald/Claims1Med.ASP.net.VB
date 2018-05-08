DROP PROCEDURE [dbo].[MemberBenefitUtilisation]
GO

CREATE PROCEDURE [dbo].[MemberBenefitUtilisation]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id as int = 0,
	@type as int = 1,
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;
	
	/*
	declare @utilisation1 table (
		plan_id int,
		schedule_id int,
		parent_id int,
		item_no smallint,
		benefit_name char(100),
		currency_code char(3),
		limit money,
		max_units money,
		claimed_amount money,
		approved_amount money,	
		approved_units money,
		deductible money
	)

	IF @type = '1'
	BEGIN
		INSERT INTO @utilisation1
			EXEC [ssp_member_benefit_utilization_1] @CLAIM_NO = NULL, @IP_ID = @id
	END ELSE IF @type = '2'
	BEGIN
		INSERT INTO @utilisation1
			EXEC [ssp_member_benefit_utilization_2] @CLAIM_NO = NULL, @IP_ID = @id
	END

	SELECT * FROM @utilisation1
	*/

	IF @type = '1'
	BEGIN
		EXEC [ssp_member_benefit_utilization_1] @CLAIM_NO = NULL, @IP_ID = @id
	END ELSE IF @type = '2'
	BEGIN
		EXEC [ssp_member_benefit_utilization_2] @CLAIM_NO = NULL, @IP_ID = @id
	END
END
GO
