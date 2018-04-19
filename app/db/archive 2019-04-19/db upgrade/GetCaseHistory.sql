DROP PROCEDURE [dbo].[GetCaseHistory]
GO

CREATE PROCEDURE [dbo].[GetCaseHistory]
/****************************************************************************************************
 Update History:
 ===============
 05-OCT-2017
****************************************************************************************************/
@member_id int = 0,
@claim_id int = NULL,
@sort as varchar(100) = 'reference_no',
@order varchar(10) = 'asc',
@visit_id as bigint = 0
AS
BEGIN 
	SET NOCOUNT ON

	select 
		* 
	FROM v_case_history
	WHERE member_id = @member_id -- AND CLAIM_NO <> @CLAIM_NO
END

GO
