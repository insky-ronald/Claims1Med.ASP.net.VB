DROP PROCEDURE [dbo].[GetServiceItems] 
GO

CREATE PROCEDURE [dbo].[GetServiceItems] 
-- ***************************************************************************************************
-- Last modified on
-- 06-OCT-2017
-- *************************************************************************************************** 
-- exec [GetServiceItems] @id = 70617509
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
	--DECLARE @user_id AS int = 0

	DECLARE @items TABLE (
		plan_seq_no int,
		id int,
		parent_id int,
		benefit_name varchar(100),
		sort varchar(40),
		schedule_id int,
		item_no smallint,
		claim_id int,
		item_id int ,
		service_id int ,
		sequence_no tinyint ,
		diagnosis_code char(10),
		benefit_code char (100) ,
		units smallmoney ,
		estimate money ,
		actual_amount money ,
        breakdown money ,
	    approved_amount money ,
		ex_gratia money ,
		declined_amount money,
		deductible money,
		payable money ,
		paid money ,
		status_code char (1) ,
		sub_status_code char (3) ,
		status_date datetime ,
		status_user varchar (10) ,
		approved_date datetime ,
		approved_user varchar (10) ,
		authorised_date datetime ,
		authorised_user varchar (10) ,
		notes varchar(max) ,
		create_date datetime ,
		create_user varchar (10) ,
		update_date datetime ,
		update_user varchar (10) ,
		service_type char(3),
		is_detail bit,
		is_novalidate bit,
		is_exclusion bit,
        is_breakdown bit,
		is_recover tinyint,
		is_show_diagnosis bit,
		currency_code char(3)
	)

	INSERT INTO @items
		EXEC [dbo].[ssp_service_detail] @INVOICE_ID = @id
	
	
	;WITH cte AS (
		SELECT
			id,
			--parent_id,
			--benefit_name,
			cast(row_number() over(partition by parent_id order by sort) as varchar(max)) as [path]
		FROM @items
		WHERE parent_id = 0
		UNION ALL
		SELECT
			t.id,
			--t.parent_id,
			--t.benefit_name,
			[path] + cast(row_number()over(partition by t.parent_id order by t.sort) as varchar(max))
		FROM cte
		JOIN @items t ON cte.id = t.parent_id
	) 
	SELECT
		t.id,
		t.parent_id,
		t.benefit_name,
		--t.sort,
		t.schedule_id,
		t.item_no,
		t.claim_id,
		t.item_id ,
		t.service_id ,
		t.sequence_no,
		t.diagnosis_code,
		t.benefit_code,
		t.units  ,
		t.currency_code,
		t.estimate  ,
		t.actual_amount  ,
        t.breakdown  ,
	    t.approved_amount  ,
		t.ex_gratia  ,
		t.declined_amount ,
		t.deductible ,
		t.payable  ,
		t.paid  ,
		t.status_code,
		t.sub_status_code,
		t.status_date ,
		t.status_user,
		t.approved_date ,
		t.approved_user,
		t.authorised_date ,
		t.authorised_user,
		t.notes,
		--t.create_date ,
		--t.create_user,
		--t.update_date ,
		--t.update_user,
		t.service_type,
		t.is_detail,
		t.is_novalidate,
		t.is_exclusion,
        t.is_breakdown,
		t.is_recover,
		t.is_show_diagnosis		
	FROM cte 
	JOIN @items t ON cte.id = t.id
	--WHERE t.is_breakdown = 0
	ORDER BY cte.path

	SELECT 
		sum(estimate) as estimate,
		sum(actual_amount) as actual_amount,
        -- sum(breakdown) as breakdown,
	    sum(approved_amount) as approved_amount,
		sum(ex_gratia) as ex_gratia,
		sum(declined_amount) as declined_amount,
		sum(deductible) as deductible,
		sum(payable) as payable,
		sum(paid) as paid
	FROM @items 
	
END
GO
