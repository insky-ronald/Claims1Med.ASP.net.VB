<%@ WebHandler Language="VB" Class="Api" %>

Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Drawing.Drawing2D

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		If Cmd = "file"
			
		Else If Cmd = "test"
			If Request.Files.Count > 0
				Dim FileName As String = Request.Files(0).FileName
				Dim TempFileName As String
				REM Dim Size As Integer = 125
				Dim Width As Integer = Request.Params("width")
				Dim Height As Integer = Request.Params("height")
				Dim ID As Integer 
				
				REM Output.AsString("FileName") = FileName
				REM Return
				Using Image = DBConnections("DBAnp").PrepareCommand("AddImage")
					
					If Request.Params("parent_type") IsNot Nothing
						Image.SetParameter("parent_type", Request.Params("parent_type"))
					End if
					If Request.Params("parent_id") IsNot Nothing
						Image.SetParameter("parent_id", Request.Params("parent_id"))
					End if
					Image.SetParameter("file_name", Request.Files(0).FileName)
					Image.SetParameter("image_type", Request.Params("image_type"))
					Image.SetParameter("size", Request.Params("size"))
					Image.SetParameter("width", Width)
					Image.SetParameter("height", Height)
					Image.SetParameter("action", 20)
					Image.SetParameter("visit_id", Session("VisitorID"))
					Image.Execute
					
					ID = Image.GetParameter("id").Value
					FileName = String.Format("{0:00000000}.img", ID)
					TempFileName = String.Format("{0:00000000}.tmp", ID)
				End Using

				REM Output.AsString("TempFileName") = TempFileName
				REM Output.AsString("GetImagePath") = Images.GetImagePath(TempFileName)
				REM Return
				Try
					Request.Files(0).SaveAs(Images.GetImagePath(TempFileName))
					Using Img = New Bitmap(Images.GetImagePath(TempFileName))
						Using Thumb = New Bitmap(Width, Height)
							Using G = Graphics.FromImage(Thumb)
								G.InterpolationMode = InterpolationMode.HighQualityBicubic
								G.SmoothingMode = SmoothingMode.HighQuality
								G.PixelOffsetMode = PixelOffsetMode.HighQuality
								G.CompositingQuality = CompositingQuality.HighQuality
								G.DrawImage(Img, 0, 0, Width, Height)
								Thumb.Save(Images.GetImagePath(FileName), ImageFormat.Jpeg)
							End Using
						End Using
					End Using
					
					UpdateImage(ID, Images.GetImageFileSize(ID), Session("VisitorID"))
					
					Dim Dir = New System.IO.DirectoryInfo(AppUtils.Settings.AsString("DocumentPath"))
					For Each File In Dir.EnumerateFiles(String.Format("{0:00000000}*.tmp", ID))
						File.Delete()
					Next
										
					REM OptimizeImage(ID, Session("VisitorID"))
					REM Request.Files(0).SaveAs(Images.GetImagePath(TempFileName))
					REM CreateCopy(Width, Height, ID, FileName)
				Catch E As Exception
					Output.AsJson("status") = -1
				Finally				
					Output.AsJson("status") = 1
					REM Output.AsJson("size") = Request.Params("size")
					REM Output.AsJson("width") = Request.Params("width")
					REM Output.AsJson("height") = Request.Params("height")
					REM Output.AsJson("parent_type") = Request.Params("parent_type")
					REM Output.AsJson("parent_id") = Request.Params("parent_id")
					REM Output.AsString("image_type") = Request.Params("image_type")
				End Try
				
				If Output.AsJson("status") = 1
					Images.CreateThumbnail(125, ID, FileName)
					If Request.Params("parent_type") = 20 'Project image
						Images.CreateThumbnail(400, ID, FileName)
					End if
					If Request.Params("parent_type") = 25 'Project image gallery
						REM If Width > 800 or Height > 800
							REM Images.CreateThumbnail(800, ID, FileName)
						REM End if
						If Width > 1024 or Height > 1024
							Images.CreateThumbnail(1024, ID, FileName, "gallery")
						End if
					End if
				End if
			Else
				Output.AsJson("status") = 0
			End if
			
			REM Output.AsJson("status") = Request.Files.Count
			
			REM Try
				REM Using DBLocations As System.Data.DataTable = DBConnections("DBTnp").OpenData("GetMainLocations", {"visit_id"}, {1}, "")
					
				REM End Using
			REM Catch E as Exception
				REM Output.AsString("error") = E.Message
			REM End Try
		End if
	End Sub
	
End Class
