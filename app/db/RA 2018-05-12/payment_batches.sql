USE [MEDICS52]
GO

CREATE view [dbo].[payment_batches] as
select 
	BATCH_NO as batch_no,
	BATCH_NAME as batch_name,
	REMARKS as remarks,
	POSTED as is_posted
from tb_payment_batches	

GO


