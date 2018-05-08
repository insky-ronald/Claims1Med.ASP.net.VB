DROP PROCEDURE [dbo].[GetDoctorsByHospital]
GO

CREATE PROCEDURE [dbo].[GetDoctorsByHospital]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@id int = 0,
	@hospital_id int = 0,
	@filter as varchar(100) = '',
	@category int = 0,
    @page int = 1, 
	@pagesize int = 0, 
	@row_count int = 0 OUTPUT, 
	@page_count int = 0 OUTPUT, 
	@sort varchar(200) = 'name',
	@order varchar(10) = 'asc',
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @source varchar(100) = 'v_doctors_by_hospital'
	DECLARE @where nvarchar(500) = '[name] like @filter'
	DECLARE @where2 nvarchar(500)
	DECLARE @columns varchar(100) = '*' 

	IF @category = 1
	BEGIN
		SET @source = 'doctors'
	END

	IF LEN(@filter) = 0 and @category=0 and @id > 0
	BEGIN
		SET @source = 'doctors'
		EXEC RunDynamicQueryBuilder1 @name='id', @value=@id, @type='n', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT
	END

	IF @source = 'v_doctors_by_hospital'
	BEGIN
		EXEC RunDynamicQueryBuilder1 @name='hospital_id', @value=@hospital_id, @type='n', @logic='and', @operator='=', @brackets= 0, @where=@where2 OUTPUT
	END ELSE
		SET @columns = 'id, name, specialisation'

	EXEC RunSimpleDynamicQuery
        @source = @source,
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
GO
