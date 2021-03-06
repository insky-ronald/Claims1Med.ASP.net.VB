DROP PROCEDURE [dbo].[GetLimits]
GO

CREATE PROCEDURE [dbo].[GetLimits]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
    @schedule_id int = 0,
	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
	@sort varchar(200) = 'rule_code',
	@order varchar(10) = 'asc',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_id AS int = 0
    
	IF @action = 10
	BEGIN
		SELECT 
			l.*,
			p.currency_code
		FROM limits l 
			JOIN schedule s on l.schedule_id = s.id
			JOIN schedule_history h on s.plan_schedule_id = h.id
			JOIN plans p on h.plan_code = p.code
		WHERE l.id = @id

		RETURN
	END

	SELECT
		l.*,
		r.rule_name,
		p.currency_code
	FROM limits l
		JOIN validation_rules r on l.rule_code = r.code
		JOIN schedule s on l.schedule_id = s.id
		JOIN schedule_history h on s.plan_schedule_id = h.id
		JOIN plans p on h.plan_code = p.code
	WHERE l.schedule_id = @schedule_id
END
GO
