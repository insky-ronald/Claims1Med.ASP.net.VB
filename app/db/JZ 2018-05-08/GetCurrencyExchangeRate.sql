DROP PROCEDURE [dbo].[GetCurrencyExchangeRate]
GO

CREATE PROCEDURE [dbo].[GetCurrencyExchangeRate]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
	@src_crcy char(3) = '',
	@dst_crcy char(3) = '',
	@rate_date datetime = null,
	@amount float = 0 output,
	@visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;
	
	EXEC ssp_cross_rate
		@src_crcy = @src_crcy,
		@dst_crcy = @dst_crcy,
		@rate_date = @rate_date,
		@amount = @amount output

	--SELECT @amount
END
GO
