DROP PROCEDURE [dbo].[GetCurrencyExchangeRateSet]
GO

CREATE PROCEDURE [dbo].[GetCurrencyExchangeRateSet]
-- ***************************************************************************************************
-- Last modified on
-- ~/app/api/command/currency-rate-set?currencies=AON=AON,AON=AON,AON=USD&date=2018-01-01
-- *************************************************************************************************** 
(
	@currencies varchar(1024) = '',
	@rate_date datetime = null,
	@rates varchar(2014) = '' output,
	@visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @sets table (
		id int identity(1,1),
		crcy varchar(10)
	)

	DECLARE @rates_table table (
		id int identity(1,1),
		src char(3),
		dst char(3),
		amount float
	)

	INSERT INTO @sets(crcy)
		SELECT value FROM f_split(@currencies, ',')

	DECLARE @id int = 1
	DECLARE @crcy varchar(10)
	DECLARE @src varchar(3), @dst varchar(3), @amount float
	WHILE EXISTS(SELECT * FROM @sets WHERE id = @id)
	BEGIN
		SELECT
			@crcy = crcy 
		FROM @sets WHERE id = @id

		SET @src = LEFT(@crcy, 3)
		SET @dst = SUBSTRING(@crcy, 5, 3)

		EXEC GetCurrencyExchangeRate
			@src_crcy = @src, 
			@dst_crcy = @dst, 
			@rate_date = @rate_date,
			@amount = @amount output, 
			@visit_id = @visit_id

		INSERT INTO @rates_table(src, dst, amount) VALUES(@src, @dst, ISNULL(@amount, 0))

		SET @id = @id + 1
	END

	SET @rates = NULL
	SELECT
		 --@rates = COALESCE(@rates + ',' , '') + LTRIM(STR(amount))
		 --@rates = COALESCE(@rates + ',' , '') + LTRIM(STR(amount, 10, 60))
		 --@rates = COALESCE(@rates + ',' , '') + LTRIM(CAST(amount as varchar(60)))
		 @rates = COALESCE(@rates + ',' , '') + LTRIM(CONVERT (VARCHAR(50), amount,128))
	FROM @rates_table

	SET @rates = '[' + @rates + ']'

	--SELECT * FROM @rates_table
END
GO
