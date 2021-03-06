DROP PROCEDURE [dbo].[GetScheduleHistory]
GO

CREATE PROCEDURE [dbo].[GetScheduleHistory]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @id int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    
	SELECT
		h.*,
		p.plan_name,
		r.product_name,
		c.full_name as client_name
	FROM schedule_history h
	JOIN plans p on h.plan_code = p.code
	JOIN products r on p.product_code = r.code
	JOIN clients c on r.client_id = c.id
	WHERE h.id = @id
END
GO
