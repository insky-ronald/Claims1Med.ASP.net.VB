DROP PROCEDURE [dbo].[GetScheduleExclusions]
GO

CREATE PROCEDURE [dbo].[GetScheduleExclusions]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @schedule_id int = 0,
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
	@sort varchar(200) = 'benefit_code',
	@order varchar(10) = 'asc',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_id AS int = 0

	SELECT 
		s.schedule_id,
		s.benefit_code,
		b.benefit
	FROM schedule_exclusions s
	JOIN benefits b on s.benefit_code = b.code
	WHERE s.schedule_id = @schedule_id
	ORDER BY s.benefit_code
END
GO
