DROP PROCEDURE [dbo].[GetScheduleOfBenefits]
GO

CREATE PROCEDURE [dbo].[GetScheduleOfBenefits]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@service_id int = 0,
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @sob table (
		plan_id int,
		--schedule_id int,
		id int,
		parent_id int,
		parent_no smallint,
		item_no smallint,
		benefit_class varchar(10),
		benefit_code char(10),
		benefit_name char(100),
		notes text,
		limit_option char(1),
		map_option char(1),
		create_user varchar(10),
		create_date datetime,
		update_user varchar(10),
		update_date datetime,
		--bullet_str varchar(40),
		sort varchar(40),
		flag tinyint,
		multiple_diag bit,
		surgical_type char(3),
		total_gop varchar(60),
		is_prorate bit, -- 2014-07-30: panin pro-rate,
		multiple_plan_link varchar(10),
		is_multiple_plan bit,
		is_accident bit
	)

	INSERT INTO @sob
		EXEC ssp_schedule_of_benefits @PLAN_ID=@id
		/*
	;WITH cte AS (
		SELECT
			id,
			cast(row_number() over(partition by parent_id order by sort) as varchar(max)) as [path]
		FROM @sob
		WHERE parent_id = 0
		UNION ALL
		SELECT
			t.id,
			[path] + cast(row_number()over(partition by t.parent_id order by t.sort) as varchar(max))
		FROM cte
		JOIN @sob t ON cte.id = t.parent_id
	) 
	SELECT 
		s.* 
	FROM cte t
	JOIN @sob s on t.id = t.id
	ORDER by t.path */

	SELECT 
		s.*,
		has_limit = ISNULL(l.id, 0),
		has_benefits = (SELECT count(*) FROM schedule_benefits WHERE schedule_id = s.id),
		has_exclusions = (SELECT count(*) FROM schedule_exclusions WHERE schedule_id = s.id)
	FROM @sob s
	LEFT OUTER JOIN limits l on s.id = l.schedule_id
	ORDER BY sort

END
GO
