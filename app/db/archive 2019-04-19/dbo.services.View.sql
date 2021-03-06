SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[services]
AS
	SELECT        
		INVOICE_ID AS id,
		SEQ_NO AS sequence_no,
		CLAIM_NO AS claim_id,
		CLM_TYPE AS claim_type,
		TRANS_TYPE AS service_type,
		TRANS_REF AS service_no,
		TRANS_DATE AS service_date,
		VER_NO AS version_no,
		--CLM_SUB_TYPE AS claim_sub_type,
		CLM_SUB_TYPE AS service_sub_type,
		DOC_TYPE AS document_type,
		REF_NO1 as reference_no1,
		ISNULL(LINK_GOP_ID, 0) AS link_gop_id,
		DAY_IN AS start_date,
		DAY_OUT AS end_date,
		rtrim(ICD_CODE) AS diagnosis_code,
		ICD_DESC AS diagnosis_notes,
		rtrim(FINAL_ICD) AS final_diagnosis_code,
		FINAL_CONDITION AS final_diagnosis_notes,
		rtrim(CPT_CODE) AS procedure_code,
		CPT_DESC AS procedure_notes,
		PROV_ID AS provider_id,
		DOC_ID AS doctor_id,
		TREAT_CTRY AS treatment_country_code,
		INVOICE_NO AS invoice_no,
		INV_DATE AS invoice_date,
		REC_DATE AS invoice_received_date,
		INV_INP_DATE AS invoice_entry_date,
		INV_INP_BY AS invoice_entry_user,
		DISC_TYPE AS discount_type,
		DISC_PER AS discount_percent,
		DISC_AMOUNT AS discount_amount,
		CLM_CRCY AS claim_currency_code,
		CLM_TO_BAS AS claim_currency_to_base,
		CLM_TO_CLT AS claim_currency_to_client,
		CLM_TO_ELG AS claim_currency_to_eligibility,
		CLM_RATE_DATE AS claim_currency_rate_date,
		CLM_RATE_MANUAL AS claim_currency_manual_rate,
		ACTUAL AS actual_amount,
		PAYABLE AS approved_amount,
		PAID AS paid_amount,
		SET_CRCY AS settlement_currency_code,
		SET_TO_CLM AS settlement_currency_to_claim,
		SET_TO_BAS AS settlement_currency_to_base,
		SET_TO_CLT AS settlement_currency_to_client,
		SET_TO_ELG AS settlement_currency_to_eligibility,
		SET_RATE_DATE AS settlement_currency_rate_date,
		SET_RATE_MANUAL AS settlement_currency_manual_rate,
		STATUS AS status_code,
		STATUS_CODE AS sub_status_code,
		status_date,
		status_user,
		medical_type,
		room_type,
		float_id,
		payment_id,
		payee_type,
		payee_id,
		payee_name,
		PAY_MODE AS payment_mode,
		is_recovery,
		is_exgratia,
		is_emergency,
		is_accident,
		is_surgical,
		AUTH_USER AS authorize_user,
		AUTH_DATE AS authorize_date,
		BATCH_NO AS batch_id,
		batch_user,
		batch_date,
		SET_ADVICE_ID AS settlement_advice_id,
		protection_level,
		IsDeleted AS is_deleted,
		InsertDate AS create_date,
		InsertUser AS create_user,
		UpdateDate AS update_date,
		UpdateUser AS update_user
	FROM dbo.tb_services



GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[35] 2[13] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "tb_services"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 402
               Right = 368
            End
            DisplayFlags = 280
            TopColumn = 137
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 2355
         Alias = 2265
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'services'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'services'
GO
