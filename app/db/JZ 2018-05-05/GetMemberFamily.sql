DROP PROCEDURE [dbo].[GetMemberFamily]
GO

CREATE PROCEDURE [dbo].[GetMemberFamily]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@certificate_id as int = 0,
	@sort varchar(200) = 'dependent_code',
	@order varchar(10) = 'asc',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @columns varchar(1024) = 'id,name_id,dependent_code,certificate_no,full_name,relationship,sex,dob'
	DECLARE @where2 nvarchar(500) = 'certificate_id = ' + STR(@certificate_id)

	EXEC RunSimpleDynamicQuery
        @source = 'v_members_enquiry',
        @columns = @columns,
        @filter = '',
        @where = '',
		@where2 = @where2,
        @page = 1, 
    	@pagesize = 1000000, 
    	--@row_count = @row_count OUTPUT, 
    	--@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order
END
GO
