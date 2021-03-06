ALTER PROCEDURE [dbo].[GetMembersEnquiry] 
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@filter as varchar(100) = '',
	@client_id as int = 0,
	@policy_no varchar(20) = '',
	@product_code varchar(10) = '',
	@certificate_id int = 0, -- pass 1 to return family view

    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'full_name',
	@order varchar(10) = 'asc',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    DECLARE @where nvarchar(500)
	DECLARE @where2 nvarchar(500)
	DECLARE @columns varchar(255) = '*'

	IF @certificate_id > 0
	BEGIN
		SET @columns = 'id,full_name,relationship_code,sex,dob'
		SET @where = ''
		SET @where2 = 'certificate_id = ' + STR(@certificate_id)
		SET @filter = ''
	END ELSE
		SET @where = '[full_name] like @filter'
   
	IF @client_id > 0
		IF LEN(@where2) > 0
			SET @where2 = @where2 + ' AND client_id = ' + STR(@client_id)
		ELSE
			SET @where2 = 'client_id = ' + STR(@client_id)

	EXEC RunSimpleDynamicQuery
        @source = 'v_members_enquiry',
		@columns = @columns,

        @filter = @filter,
        @where = @where,
		@where2 = @where2,
        
        @page = @page, 
    	@pagesize = @pagesize, 
    	@row_count = @row_count OUTPUT, 
    	@page_count = @page_count OUTPUT,
        @sort = @sort,
        @order = @order

END


