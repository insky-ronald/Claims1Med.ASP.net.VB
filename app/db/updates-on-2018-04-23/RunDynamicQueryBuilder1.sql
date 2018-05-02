DROP PROCEDURE [dbo].[RunDynamicQueryBuilder1] 
GO

CREATE PROCEDURE [dbo].[RunDynamicQueryBuilder1] 
-- ***************************************************************************************************
-- Last modified on
-- 15-SEP-2017
-- *************************************************************************************************** 
(
	@name varchar(100) = '',
	@value varchar(1000) = '',
	@type char(1) = '',
	@logic varchar(10) = 'and',
	@operator varchar(10) = '',
	@brackets bit = 0,
	@where nvarchar(2000) = '' OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

/* 	IF @type = 'd' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '
		IF LEN(@parameters) > 0 SET @parameters = @parameters + ', '
		IF LEN(@values) > 0 SET @values = @values + ', '

		SET @where = @where + 'CONVERT(date, '+@column_name+') '+@operator+' @'+@name
		SET @parameters = @parameters + '@'+@name +' datetime'
		--SET @values = @values + '@'+@name+' = '''+CONVERT(char(10), @date, 126)+''''
		SET @values = @values + '@'+@name+' = '''+CONVERT(char(10), CAST(@value as date), 126)+''''
	END 
	ELSE IF @type = 'n' AND @operator = 'in' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where + ' AND '

		SET @where = @where + @column_name+' '+@operator+' ('+@value+')'
	END ELSE */
	SET @where = ISNULL(@where, '')

	IF @brackets = 1
		SET @where = '('+@where+')'

	IF @type = 'c' AND @operator = 'in' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where +' '+ @logic +' '

		SET @where = @where + @name+' '+@operator+' ('+''''+replace(@value, ',', ''',''')+''''+')'
	END ELSE
	IF @type = 'n' AND @operator = 'in' AND LEN(@value) > 0
	BEGIN
		IF LEN(@where) > 0 SET @where = @where +' '+ @logic +' '

		SET @where = @where + @name+' '+@operator+' ('+@value+')'
	END
END

GO

