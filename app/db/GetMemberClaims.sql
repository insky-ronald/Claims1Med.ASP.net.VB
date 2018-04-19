DROP PROCEDURE [dbo].[GetMemberClaims]
GO

CREATE PROCEDURE [dbo].[GetMemberClaims]
-- ***************************************************************************************************
-- Last modified on
-- 26-SEP-2017
-- *************************************************************************************************** 
(
	@member_id int = 0,

	@action int = 0, -- 0:list, 1:lookup, 10:for editing, 20:for new record, 50:fetch updated data
    @page int = 1,
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'claim_no',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @user_id AS int = 0
	DECLARE @where2 nvarchar(100) = '[member_id] = ' + STR(@member_id)

	EXEC RunSimpleDynamicQuery
		@source = 'v_claims',
		@columns = '*',
		@where2 = @where2,
		@page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
		@sort = @sort,
		@order = @order
END

GO


