SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetServiceItemsEligible] 
-- ***************************************************************************************************
-- Last modified on
-- 14-OCT-2014 ihms.0.0.1.0
-- *************************************************************************************************** 
(
    @id int = 0, 
	@service_type char(3) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0

	CREATE TABLE #items (
		plan_seq_no int,
		id int,
		parent_id int,
		service_id int,
		claim_id int,
		schedule_id int,
		benefit_class varchar(10) ,
		benefit_code char(10) ,
		benefit_name char(110) ,
        diagnosis_code char(10), -- Added for ticket 835737
		units_required bit,
		units smallmoney,
		units_name varchar(20) ,
		currency_code char(3) ,
        amount money,
		mapping_option char(1) ,
		is_detail bit,
		is_include bit,
        is_split bit, -- Added for ticket 835737
        is_multiple_diagnosis bit, -- Added for ticket 835737
        has_breakdown bit, -- Added for ticket 835737
        surgical_type char(3),
		create_user varchar(10) ,
		create_date datetime,
		update_user varchar(10) ,
		update_date datetime,
		sort varchar(40)  -- Used internally for sorting the tree
	)

	INSERT INTO #items
		EXEC ssp_service_detail_schedule @INVOICE_ID = @id, @TRANS_TYPE = @service_type

/*	ALTER TABLE #items DROP COLUMN create_user
	ALTER TABLE #items DROP COLUMN create_date
	ALTER TABLE #items DROP COLUMN update_user
	ALTER TABLE #items DROP COLUMN update_date
	ALTER TABLE #items DROP COLUMN sort */

	SELECT 
		id,
		parent_id,
		service_id,
		claim_id,
		schedule_id,
		rtrim(benefit_class) as benefit_class,
		rtrim(benefit_code) as benefit_code,
		rtrim(benefit_name) as benefit_name,
        diagnosis_code,
		units_required,
		units,
		units_name,
		currency_code,
        amount,
		mapping_option,
        has_breakdown,
		is_detail,
		is_include,
        is_split,
        is_multiple_diagnosis,
        surgical_type,
		plan_seq_no,
		sort
	FROM #items 
	ORDER BY sort

	DROP TABLE #items
END


GO
