SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetServiceItems] 
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
		PLAN_SEQ_NO int,
		id int,
		parent_id int,
		benefit_name varchar(100), -- 19-JAN-2016
		sort varchar(40),
		schedule_id int,
		item_no smallint,
		claim_id int ,
		item_id int ,
		service_id int ,
		sequence_no tinyint ,
		diagnosis_code char(10),--added 6-29 2012
		benefit_code char (100) , -- 24-OCT-2014
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

	INSERT INTO #items
		EXEC ssp_service_detail @INVOICE_ID = @id

	ALTER TABLE #items ADD level int
	ALTER TABLE #items ADD has_children bit

	DECLARE @temp TABLE (
		id int
	)

	INSERT INTO @temp(id)
		SELECT DISTINCT parent_id FROM #items

	UPDATE #items 
		SET has_children = 1
	FROM #items i
	JOIN @temp t on i.id = t.id

	UPDATE #items
		SET has_children = 0
	WHERE has_children is NULL

	;WITH cte(id,original_policy_id,sequence) AS (
		SELECT 
			id,
			parent_id,
			ROW_NUMBER() OVER(PARTITION BY parent_id ORDER BY sort ASC) AS Row
		FROM #items
	)
	UPDATE #items SET
		item_no = cte.sequence
	FROM cte
	join #items ON cte.id = #items.id

	UPDATE #items SET
		sort = replace(sort, '00', '') + replace(str(item_no, 2), ' ', '0')
	WHERE is_detail = 1 and is_breakdown = 0 and is_exclusion = 0

	UPDATE #items SET
		sort = replace(sort, '01', '') + replace(str(item_no, 2), ' ', '0')
	WHERE is_detail = 1 and is_breakdown = 0 and is_exclusion = 1

	UPDATE #items SET
		sort = (SELECT sort FROM #items x WHERE x.id = #items.parent_id) +'.'+ replace(str(item_no, 2), ' ', '0')
	WHERE is_breakdown = 1

	;WITH cte AS (
		SELECT
			id,
			parent_id,
			1 as level
		FROM #items
		WHERE parent_id = 0
		UNION ALL
		SELECT
			c.id,
			c.parent_id,
			p.level + 1
		FROM #items c
		JOIN cte p on p.id = c.parent_id
	) UPDATE #items
		SET level = c.level
	FROM cte c JOIN #items i on c.id = i.id


	SELECT 
		i.id ,
		i.parent_id ,
		rtrim(i.benefit_code) as benefit_code,
		rtrim(i.benefit_name) as benefit_name,
		--i.sort,
		--i.sort2,
		i.schedule_id ,
		--item_no ,
		--claim_id  ,
		i.service_id  ,
		i.item_id  ,
		--sequence_no,
		i.diagnosis_code,
		i.currency_code,
		i.units,
		i.estimate,
		i.actual_amount,
        i.breakdown,
	    i.approved_amount,
		i.ex_gratia,
		i.declined_amount,
		i.deductible,
		i.payable,
		i.paid,
		i.status_code,
		i.sub_status_code,
		--status_date,
		--status_user,
		--approved_date,
		--approved_user,
		--authorised_date,
		--authorised_user,
		rtrim(replace(i.notes, char(13), '')) as notes,
		--create_date,
		--create_user,
		--update_date,
		--update_user,
		i.is_detail,
		i.is_novalidate,
		i.is_exclusion,
        i.is_breakdown,
		i.is_recover,
		i.is_show_diagnosis,
		i.service_type,
		i.plan_seq_no ,
		i.level,
		i.has_children
	FROM #items i
	ORDER BY sort
	
	SELECT 
		sum(estimate) as estimate,
		sum(actual_amount) as actual_amount,
        sum(breakdown) as breakdown,
	    sum(approved_amount) as approved_amount,
		sum(ex_gratia) as ex_gratia,
		sum(declined_amount) as declined_amount,
		sum(deductible) as deductible,
		sum(payable) as payable,
		sum(paid) as paid
	FROM #items 
	
	DROP TABLE #items
END


GO
