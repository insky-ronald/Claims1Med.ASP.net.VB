DROP PROCEDURE [dbo].[GetServiceBreakdownExclusions] 
GO

CREATE PROCEDURE [dbo].[GetServiceBreakdownExclusions] 
-- ***************************************************************************************************
-- Last modified on
-- 06-OCT-2017
-- *************************************************************************************************** 
-- exec [GetServiceBreakdownExclusions] @id = 70617509
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
		benefit_code char(10) ,
		benefit_name char(100) ,
		currency_code char(3) ,
		amount money,
		is_detail bit,
		is_include bit,
		create_date datetime ,
		create_user varchar (10) ,
		update_date datetime ,
		update_user varchar (10) ,
		bullet_str varchar(40) 
	)

	INSERT INTO @items
		EXEC [dbo].[ssp_service_detail_exclusions] @INVOICE_ID = @id
	
	SELECT * FROM @items
END
GO
