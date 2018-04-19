REM ***************************************************************************************************
REM Last modified on
REM 05-JAN-2014 ihms.0.0.1.8 Strong password
REM ***************************************************************************************************
Imports Microsoft.VisualBasic
Imports System.IO
Imports System.Data                                                                                        
Imports Newtonsoft.Json

Imports System.Security
Imports System.Security.Cryptography
REM Imports System.IO
Imports System.Runtime.InteropServices
Imports System.Text.RegularExpressions
Imports System.Text

Public Module Encryption
	Public Function Encrypt(ByVal plainText As String, ByVal passPhrase As String, ByVal saltValue As String) As String
		REM Dim passPhrase As String = "yourPassPhrase"
		REM Dim saltValue As String = "mySaltValue"
		Dim hashAlgorithm As String = "SHA1"
		Dim passwordIterations As Integer = 2
		Dim initVector As String = "@1B2c3D4e5F6g7H8"
		Dim keySize As Integer = 256
		Dim initVectorBytes As Byte() = Encoding.ASCII.GetBytes(initVector)
		Dim saltValueBytes As Byte() = Encoding.ASCII.GetBytes(saltValue)
		Dim plainTextBytes As Byte() = Encoding.UTF8.GetBytes(plainText)
		Dim password As New PasswordDeriveBytes(passPhrase, saltValueBytes, hashAlgorithm, passwordIterations)
		Dim keyBytes As Byte() = password.GetBytes(keySize \ 8)
		Dim symmetricKey As New RijndaelManaged()
		symmetricKey.Mode = CipherMode.CBC
		Dim encryptor As ICryptoTransform = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes)
		Dim memoryStream As New MemoryStream()
		Dim cryptoStream As New CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write)
		cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length)
		cryptoStream.FlushFinalBlock()
		Dim cipherTextBytes As Byte() = memoryStream.ToArray()
		memoryStream.Close()
		cryptoStream.Close()
		Dim cipherText As String = Convert.ToBase64String(cipherTextBytes)
		Return cipherText
	End Function
	
	Public Function Decrypt(ByVal cipherText As String, ByVal passPhrase As String, ByVal saltValue As String) As String
	REM Dim passPhrase As String = "yourPassPhrase"
	REM Dim saltValue As String = "mySaltValue"
	Dim hashAlgorithm As String = "SHA1"
	Dim passwordIterations As Integer = 2
	Dim initVector As String = "@1B2c3D4e5F6g7H8"
	Dim keySize As Integer = 256
	' Convert strings defining encryption key characteristics into byte
	' arrays. Let us assume that strings only contain ASCII codes.
	' If strings include Unicode characters, use Unicode, UTF7, or UTF8
	' encoding.
	Dim initVectorBytes As Byte() = Encoding.ASCII.GetBytes(initVector)
	Dim saltValueBytes As Byte() = Encoding.ASCII.GetBytes(saltValue)
	' Convert our ciphertext into a byte array.
	Dim cipherTextBytes As Byte() = Convert.FromBase64String(cipherText)
	' First, we must create a password, from which the key will be
	' derived. This password will be generated from the specified
	' passphrase and salt value. The password will be created using
	' the specified hash algorithm. Password creation can be done in
	' several iterations.
	Dim password As New PasswordDeriveBytes(passPhrase, saltValueBytes, hashAlgorithm, passwordIterations)
	' Use the password to generate pseudo-random bytes for the encryption
	' key. Specify the size of the key in bytes (instead of bits).
	Dim keyBytes As Byte() = password.GetBytes(keySize \ 8)
	' Create uninitialized Rijndael encryption object.
	Dim symmetricKey As New RijndaelManaged()
	' It is reasonable to set encryption mode to Cipher Block Chaining
	' (CBC). Use default options for other symmetric key parameters.
	symmetricKey.Mode = CipherMode.CBC
	' Generate decryptor from the existing key bytes and initialization
	' vector. Key size will be defined based on the number of the key
	' bytes.
	Dim decryptor As ICryptoTransform = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes)
	' Define memory stream which will be used to hold encrypted data.
	Dim memoryStream As New MemoryStream(cipherTextBytes)
	' Define cryptographic stream (always use Read mode for encryption).
	Dim cryptoStream As New CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read)
	' Since at this point we don't know what the size of decrypted data
	' will be, allocate the buffer long enough to hold ciphertext;
	' plaintext is never longer than ciphertext.
	Dim plainTextBytes As Byte() = New Byte(cipherTextBytes.Length - 1) {}
	' Start decrypting.
	Dim decryptedByteCount As Integer = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length)
	' Close both streams.
	memoryStream.Close()
	cryptoStream.Close()
	' Convert decrypted data into a string.
	' Let us assume that the original plaintext string was UTF8-encoded.
	Dim plainText As String = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount)
	' Return decrypted string.
	Return plainText
	End Function
	
End Module

Public Module EvalExpression
		Public Function Eval(DBData As DataTable, Expression As String) As String
			Dim Columns As New List(Of String)
			For Each Column in DBData.Columns
				Columns.Add(Column.ColumnName)
			Next

			Columns.Sort(Function(x, y) String.Compare(y, x))
			For Each ColumnName in Columns
				Expression = Expression.Replace("@" & ColumnName, DBData.Rows(0).Item(ColumnName).ToString)
			Next

			Return Expression
		End Function
End Module

Public Module EasyApp

	REM added on ihms.0.0.1.8
	Function ValidatePassword(ByVal pwd As String, 
		Optional ByVal minLength As Integer = 8, 
		Optional ByVal numUpper As Integer = 2, 
		Optional ByVal numLower As Integer = 2, 
		Optional ByVal numNumbers As Integer = 2, 
		Optional ByVal numSpecial As Integer = 2) As Boolean 

		' Replace [A-Z] with \p{Lu}, to allow for Unicode uppercase letters. 
		Dim upper As New System.Text.RegularExpressions.Regex("[A-Z]")
		Dim lower As New System.Text.RegularExpressions.Regex("[a-z]")
		Dim number As New System.Text.RegularExpressions.Regex("[0-9]")
		' Special is "none of the above". 
		Dim special As New System.Text.RegularExpressions.Regex("[^a-zA-Z0-9]")

		' Check the length. 
		If Len(pwd) < minLength Then Return False 
		' Check for minimum number of occurrences. 
		If upper.Matches(pwd).Count < numUpper Then Return False 
		If lower.Matches(pwd).Count < numLower Then Return False 
		If number.Matches(pwd).Count < numNumbers Then Return False 
		If special.Matches(pwd).Count < numSpecial Then Return False 

		' Passed all checks. 
		Return True 
	End Function 

	Public Function SplitParts(ByVal Str As String, Optional Def As String = "") As String()
		Dim Parts As String() = Str.Split(".")
		If Parts.Length > 1
			Return Parts
		Else
			Return {Def, Parts(0)}
		End if
	End Function 

    Public Function IsMemberOf(ByVal RoleID As Integer)
				Dim Roles As List(Of String) = HttpContext.Current.Session("Roles").ToString.Split(",").ToList
        Return Roles.Contains(RoleID.ToString)
    End Function

    Public Function BrowserName() As String 
        Dim UserAgent As String = HttpContext.Current.Request.UserAgent		
        Dim BrowserCapabilities As System.Web.HttpBrowserCapabilities = HttpContext.Current.Request.Browser
		Dim Browser As String = BrowserCapabilities.Browser.ToLower
		If Browser = "chrome" and UserAgent.IndexOf("Edge") >= 0
			Browser = "edge"
		End if
        ' Dim Browser As System.Web.HttpBrowserCapabilities = HttpContext.Current.Request.Browser
        Return Browser
    End Function
    
    Public Function BrowserVer() As Integer
        Dim Browser As System.Web.HttpBrowserCapabilities = HttpContext.Current.Request.Browser
        Return CType(Browser.MajorVersion, Integer)
    End Function
    
    Public Function IsIE6() As Boolean 'Used in Mayfair.vb
        Dim Browser As System.Web.HttpBrowserCapabilities = HttpContext.Current.Request.Browser

        if Browser.Browser = "IE" and Browser.MajorVersion  <= "7" 'changed to 7, floating "links" button is in the middle. ronald - june 1, 2011
            Return True
        else
            Return False
        end if
    End Function

    Public Function IsIE8() As Boolean 'Used in Mayfair.vb
        Dim Browser As System.Web.HttpBrowserCapabilities = HttpContext.Current.Request.Browser

        if Browser.Browser = "IE" and Browser.MajorVersion  <= "8"
            Return True
        else
            Return False
        end if
    End Function

    Public Function IsMobile() As Boolean
		Dim u As String = HttpContext.Current.Request.ServerVariables("HTTP_USER_AGENT")
		Dim b As New Regex("(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino", RegexOptions.IgnoreCase)
		Dim v As New Regex("1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-", RegexOptions.IgnoreCase)
		If b.IsMatch(u) Or v.IsMatch(Left(u, 4)) Then 
			Return True
		Else
			Return False
		End if
    End Function

    Public Function CreatePanel(ByVal Container As Control, ByVal CssClass As String, ByVal Style As String, Optional ByVal ID As String = "") As WebControl
        Dim Div As New Panel
        if CssClass <> String.Empty
            Div.Attributes.Add("class", CssClass)
        end if

        if Style <> String.Empty
            Div.Attributes.Add("style", Style)
        end if

        if ID <> String.Empty
            Div.ID = ID
        end if

        if Not Container is Nothing
            Container.Controls.Add(Div)
        end if

        Return Div
    End Function

    Public Function CreatePanel(ByVal CssClass As String, ByVal Optional Style As String = "") As WebControl
        Return CreatePanel(Nothing, CssClass, Style)
    End Function

    Public Function DataTableToJson(ByVal Data As DataTable, ByVal Optional UseFormatting As Boolean = True) As String
        Dim json As Newtonsoft.Json.JsonSerializer = new Newtonsoft.Json.JsonSerializer()
        json.NullValueHandling = NullValueHandling.Ignore
        json.ObjectCreationHandling = ObjectCreationHandling.Replace
        json.MissingMemberHandling = MissingMemberHandling.Ignore
        json.ReferenceLoopHandling = ReferenceLoopHandling.Ignore

        json.Converters.Add(new Newtonsoft.Json.Converters.IsoDateTimeConverter())
        json.Converters.Add(new Newtonsoft.Json.Converters.DataTableConverter())

        Dim sw As StringWriter = new StringWriter()
        Dim writer As Newtonsoft.Json.JsonTextWriter = new JsonTextWriter(sw)
        If UseFormatting
            writer.Formatting = Formatting.Indented
        Else
            writer.Formatting = Formatting.None
        End if

        writer.QuoteChar = """"

     json.Serialize(writer, Data)

        Dim JsonString = sw.ToString()

        writer.Close()
        sw.Close()

        Return JsonString
    End Function

    Public Function JsonToDataTable(ByVal JsonData As String) As DataTable
        Dim Json As Newtonsoft.Json.JsonSerializer = new Newtonsoft.Json.JsonSerializer()
        Json.NullValueHandling = NullValueHandling.Ignore
        Json.ObjectCreationHandling = ObjectCreationHandling.Replace
        Json.MissingMemberHandling = MissingMemberHandling.Ignore
        Json.ReferenceLoopHandling = ReferenceLoopHandling.Ignore

        Json.Converters.Add(new Newtonsoft.Json.Converters.IsoDateTimeConverter())
        Json.Converters.Add(new Newtonsoft.Json.Converters.DataTableConverter())

        Dim SR As StringReader = new StringReader(JsonData)
        Dim Reader As Newtonsoft.Json.JsonTextReader = new JsonTextReader(SR)

        Dim Data As DataTable = Json.Deserialize(Reader, GetType(DataTable))
      Data.AcceptChanges()
      
        Reader.Close()

        Return Data
    End Function

End Module