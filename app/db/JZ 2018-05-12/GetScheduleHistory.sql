USE [MEDICS52]
GO
/****** Object:  StoredProcedure [dbo].[GetScheduleHistory]    Script Date: 5/13/2018 7:37:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetScheduleHistory]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @id int = 0,
	@plan_code varchar(15) = '',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    
	IF LEN(@plan_code) = 0
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
	ELSE
		SELECT
			h.*
		FROM schedule_history h
		WHERE h.plan_code like @plan_code
		ORDER BY h.start_date desc
END
