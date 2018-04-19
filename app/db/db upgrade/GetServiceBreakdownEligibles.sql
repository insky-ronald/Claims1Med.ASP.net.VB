DROP PROCEDURE [dbo].[GetServiceBreakdownEligibles] 
GO

CREATE PROCEDURE [dbo].[GetServiceBreakdownEligibles] 
-- ***************************************************************************************************
-- Last modified on
-- 06-OCT-2017
-- *************************************************************************************************** 
-- exec [GetServiceBreakdownEligibles] @id = 70617510
-- *************************************************************************************************** 
(
    @id int = 0, 
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @items TABLE (
		plan_seq_no int,
		id int,
		parent_id int,
		service_id int,
		claim_id int,
		schedule_id int,
		benefit_class varchar(10) ,
		benefit_code char(10) ,
		benefit_name char(110) ,
        icd_code char(10), -- Added for ticket 835737
		units_required bit,
		units smallmoney,
		unit_name varchar(20) ,
		currency_code char(3) ,
        amount money,
		map_option char(1) ,
		is_detail bit,
		is_include bit,
        is_split bit, -- added for ticket 835737
        is_multiple_diagnosis bit, -- Added for ticket 835737
        has_breakdown bit, -- Added for ticket 835737
        surgical_type char(3),
		create_user varchar (10) ,
		create_date datetime ,
		update_user varchar (10) ,
		update_date datetime ,
		bullet_str varchar(40) 
	)

	INSERT INTO @items
		EXEC [dbo].[ssp_service_detail_schedule] @INVOICE_ID = @id, @TRANS_TYPE=''
	
	SELECT 
		id,
		parent_id,
		service_id,
		claim_id,
		schedule_id,
		benefit_class,
		benefit_code,
		benefit_name,
        icd_code,
		units_required,
		units,
		unit_name,
		currency_code,
        amount,
		map_option,
		is_detail,
		is_include,
        is_split,
        is_multiple_diagnosis,
        has_breakdown,
        surgical_type
	FROM @items
END
GO
