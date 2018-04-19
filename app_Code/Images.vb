REM ***************************************************************************************************
REM Last modified on
REM ***************************************************************************************************
Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Drawing.Drawing2D

Public Module Images	

	Public Function GetImagePath(ByVal FileName As String) As String
		Return System.IO.Path.Combine(AppUtils.Settings.AsString("DocumentPath"), FileName)
	End Function

	Public Function GetImagePathById(ByVal ID As Integer) As String
		Return System.IO.Path.Combine(AppUtils.Settings.AsString("DocumentPath"), String.Format("{0:00000000}.img", ID))
	End Function

	Public Function GetImageFileSize(ByVal ID As Integer) As Integer
		With My.Computer.FileSystem.GetFileInfo(GetImagePath(String.Format("{0:00000000}.img", ID)))
			Return .Length
		End With
		REM Dim Info As System.IO.FileInfo = My.Computer.FileSystem.GetFileInfo(GetImagePath(FileName))
		REM Return Info.Length
	End Function
	
	Public Function AddImage(ByVal ParentType As Integer, ByVal ParentID As Integer,
		ByVal FileName As String, ByVal ImageType As String,
		ByVal Size As Integer, ByVal Width As Integer, ByVal Height As Integer, ByVal VisitorID As Integer) As Integer
		
		Using Image = DBConnections("DBAnp").PrepareCommand("AddImage")
			Image.SetParameter("parent_type", ParentType)
			Image.SetParameter("parent_id", ParentID)
			
			Image.SetParameter("file_name", FileName)
			Image.SetParameter("image_type", ImageType)
			Image.SetParameter("size", Size)
			Image.SetParameter("width", Width)
			Image.SetParameter("height", Height)
			Image.SetParameter("action", 20)
			Image.SetParameter("visit_id", VisitorID)
			Image.Execute
			
			Return Image.GetParameter("id").Value
		End Using
	End Function
	
	REM Public Sub UpdateImage(ByVal ID As Integer, ByVal FileName As String, 
		REM ByVal Size As Integer, ByVal Width As Integer, ByVal Height As Integer, ByVal VisitorID As Integer) As Integer
	Public Sub UpdateImage(ByVal ID As Integer, ByVal Size As Integer, ByVal VisitorID As Integer)
		
		Using Image = DBConnections("DBAnp").PrepareCommand("AddImage")
			Image.SetParameter("id", ID)
			REM Image.SetParameter("file_name", FileName)
			Image.SetParameter("size", Size)
			REM Image.SetParameter("width", Width)
			REM Image.SetParameter("height", Height)
			Image.SetParameter("action", 10)
			Image.SetParameter("visit_id", VisitorID)
			Image.Execute
			
		End Using
	End Sub
	
	Public Sub AddImageAssignment(ByVal ID As Integer, ByVal ImageName As String, ByVal ParentType As Integer, ByVal ParentID As Integer, ByVal VisitorID As Integer)
		Using Image = DBConnections("DBAnp").PrepareCommand("AddImageAssignment")
			Image.SetParameter("image_id", ID)
			Image.SetParameter("parent_type", ParentType)
			Image.SetParameter("parent_id",  ParentID)
			Image.SetParameter("image_name", ImageName)
			Image.SetParameter("visit_id", VisitorID)
			Image.Execute
		End Using
	End Sub
	
	Public Sub DeleteImage(ByVal ID As Integer, ByVal ParentType As Integer, ByVal ParentID As Integer, ByVal VisitorID As Integer)
		Using Image = DBConnections("DBAnp").PrepareCommand("AddImage")
			Image.SetParameter("id", ID)
			Image.SetParameter("parent_type", ParentType)
			Image.SetParameter("parent_id", ParentID)
			Image.SetParameter("action", 0)
			Image.SetParameter("visit_id", VisitorID)
			Image.Execute
		End Using
		
		Dim Dir = New System.IO.DirectoryInfo(AppUtils.Settings.AsString("DocumentPath"))
		For Each File In Dir.EnumerateFiles(String.Format("{0:00000000}*.img", ID))
			File.Delete()
		Next
	End Sub
	
	Public Sub OptimizeImage(ByVal ID As Integer, ByVal VisitorID As Integer)
		Using DBImage = DBConnections("DBAnp").OpenData("GetImage", {"id"}, {ID}, "")
			Dim Width As Integer = CType(DBImage.Rows(0).Item("width"), Integer)
			Dim Height As Integer = CType(DBImage.Rows(0).Item("height"), Integer)				
		
			Dim FileName As String = String.Format("{0:00000000}.img", ID)
			Dim CopyFileName As String = String.Format("{0:00000000}.copy", ID)
			
			CreateCopy(Width, Height, ID, CopyFileName)
			Dim Dir = New System.IO.DirectoryInfo(AppUtils.Settings.AsString("DocumentPath"))
			For Each File In Dir.EnumerateFiles(String.Format("{0:00000000}*.img", ID))
				File.Delete()
			Next
			
			Dim Info As System.IO.FileInfo = My.Computer.FileSystem.GetFileInfo(Images.GetImagePath(CopyFileName))
			Info.MoveTo(Images.GetImagePath(FileName))
			UpdateImage(ID, Info.Length, VisitorID)
			Images.CreateThumbnail(125, ID, FileName)
			
		End Using
	End Sub
	
	Public Sub CreateThumbnail(ByVal Size As Integer, ByVal ID As Integer, ByVal FileName As String, Optional ByVal Suffix As String = "")
		Dim Width As Integer
		Dim Height As Integer
		
		If Suffix = ""
			Suffix = Size.ToString
		End if
		
		Dim TargetFileName As String = String.Format("{0:00000000}-T{1}.img", ID, Suffix)
		
		Using Img = New Bitmap(System.IO.Path.Combine(AppUtils.Settings.AsString("DocumentPath"), FileName))
			Dim W As Integer = Img.Width
			Dim H As Integer = Img.Height
			If H > W 
				Height = Size
				Width = CType(Size * W / H, Integer)
			Else
				Width = Size
				Height = CType(Size * H / W, Integer)
			End if
			
			Using Thumb = New Bitmap(Width, Height)
				Using G = Graphics.FromImage(Thumb)
					G.InterpolationMode = InterpolationMode.HighQualityBicubic
					G.SmoothingMode = SmoothingMode.HighQuality
					G.PixelOffsetMode = PixelOffsetMode.HighQuality
					G.CompositingQuality = CompositingQuality.HighQuality
					G.DrawImage(Img, 0, 0, Width, Height)
					Thumb.Save(System.IO.Path.Combine(AppUtils.Settings.AsString("DocumentPath"), TargetFileName), ImageFormat.Jpeg)
				End Using
			End Using
		End Using
	End Sub
	
	Public Sub CreateCopyEx(ByVal Width As Integer, ByVal Height As Integer, ByVal SourceID As Integer, ByVal TargetID As Integer)
		CreateCopy(Width, Height, SourceID, String.Format("{0:00000000}.img", TargetID))
		REM Dim Width As Integer
		REM Dim Height As Integer
		REM Dim SourceFileName As String = String.Format("{0:00000000}.img", SourceID)
		REM Dim TargetFileName As String = String.Format("{0:00000000}.img", TargetID)
		REM Dim Path As String = AppUtils.Settings.AsString("DocumentPath")
		
		REM Using Img = New Bitmap(System.IO.Path.Combine(Path, SourceFileName))		
			REM Using Thumb = New Bitmap(Width, Height)
				REM Using G = Graphics.FromImage(Thumb)
					REM G.InterpolationMode = InterpolationMode.HighQualityBicubic
					REM G.SmoothingMode = SmoothingMode.HighQuality
					REM G.PixelOffsetMode = PixelOffsetMode.HighQuality
					REM G.CompositingQuality = CompositingQuality.HighQuality
					REM G.DrawImage(Img, 0, 0, Width, Height)
					REM Thumb.Save(System.IO.Path.Combine(Path, TargetFileName), ImageFormat.Jpeg)
				REM End Using
			REM End Using
		REM End Using
	End Sub
	
	Public Sub CreateCopy(ByVal Width As Integer, ByVal Height As Integer, ByVal SourceID As Integer, ByVal TargetFileName As String)
		REM Dim Width As Integer
		REM Dim Height As Integer
		Dim SourceFileName As String = String.Format("{0:00000000}.img", SourceID)
		REM Dim TargetFileName As String = String.Format("{0:00000000}.img", TargetID)
		Dim Path As String = AppUtils.Settings.AsString("DocumentPath")
		
		Using Img = New Bitmap(System.IO.Path.Combine(Path, SourceFileName))
			REM Dim W As Integer = Img.Width
			REM Dim H As Integer = Img.Height
			REM If H > W 
				REM Height = Size
				REM Width = CType(Size * W / H, Integer)
			REM Else
				REM Width = Size
				REM Height = CType(Size * H / W, Integer)
			REM End if
			
			Using Thumb = New Bitmap(Width, Height)
				Using G = Graphics.FromImage(Thumb)
					G.InterpolationMode = InterpolationMode.HighQualityBicubic
					G.SmoothingMode = SmoothingMode.HighQuality
					G.PixelOffsetMode = PixelOffsetMode.HighQuality
					G.CompositingQuality = CompositingQuality.HighQuality
					G.DrawImage(Img, 0, 0, Width, Height)
					Thumb.Save(System.IO.Path.Combine(Path, TargetFileName), ImageFormat.Jpeg)
				End Using
			End Using
		End Using
	End Sub
End Module

