USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[GetClientCaseFees] 
GO

CREATE PROCEDURE [dbo].[GetClientCaseFees] 
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @client_id int = 0, 
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    
	SELECT *
	FROM client_case_fees
	WHERE client_id = @client_id
END





GO


