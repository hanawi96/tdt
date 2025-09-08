// Google Apps Script để nhận dữ liệu từ Cloudflare Worker và ghi vào Google Sheets
// Copy code này vào Google Apps Script Editor

// ID của Google Sheets (lấy từ URL của sheet)
const SHEET_ID = '1Je2tfaMu9_sYWiyx_NjUpuPkKPJ579atV2ASIQab-TI';

// Tên sheet (tab) để ghi dữ liệu
const SHEET_NAME = 'Đơn Hàng TDT'; // Có thể thay đổi tên sheet

function doPost(e) {
  try {
    console.log('📥 Google Script: Received POST request');
    console.log('📋 Google Script: Raw request data:', e);

    // Lấy dữ liệu từ request
    let orderData;
    if (e.postData && e.postData.contents) {
      console.log('📄 Google Script: Post data contents:', e.postData.contents);
      orderData = JSON.parse(e.postData.contents);
    } else {
      console.error('❌ Google Script: No postData found');
      throw new Error('No data received');
    }

    console.log('📋 Google Script: Parsed order data:', orderData);
    console.log('🎯 Google Script: Using SHEET_ID:', SHEET_ID);
    console.log('📊 Google Script: Using SHEET_NAME:', SHEET_NAME);
    
    // Kiểm tra SHEET_ID có được thay chưa
    if (SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
      throw new Error('SHEET_ID chưa được thay! Vui lòng thay YOUR_GOOGLE_SHEET_ID_HERE bằng ID thực của Google Sheets');
    }

    // Mở Google Sheets
    console.log('📂 Google Script: Opening spreadsheet...');
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      console.log('✅ Google Script: Spreadsheet opened successfully');
    } catch (error) {
      console.error('❌ Google Script: Cannot open spreadsheet:', error);
      throw new Error('Không thể mở Google Sheets. Kiểm tra SHEET_ID: ' + SHEET_ID);
    }

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    console.log('📋 Google Script: Sheet found:', !!sheet);

    // Nếu sheet không tồn tại, tạo mới
    if (!sheet) {
      console.log('🆕 Google Script: Creating new sheet:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    // Kiểm tra và tạo header nếu cần
    const headers = [
      'Thời gian',
      'Mã đơn hàng',
      'Tên khách hàng',
      'Số điện thoại',
      'Địa chỉ',
      'Số lượng',
      'Tổng tiền',
      'Chữ trên túi',
      'Ghi chú'
    ];

    // Kiểm tra xem có header chưa
    const firstRowData = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const hasHeader = firstRowData[0] === 'Thời gian' && firstRowData[1] === 'Mã đơn hàng';

    if (!hasHeader) {
      console.log('🆕 Google Script: Creating/updating header...');

      // Nếu có dữ liệu, chèn row mới ở đầu cho header
      if (sheet.getLastRow() > 0) {
        sheet.insertRowBefore(1);
      }

      // Tạo header với formatting
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4CAF50'); // Màu xanh lá
      headerRange.setFontColor('#FFFFFF'); // Chữ trắng
      headerRange.setHorizontalAlignment('center'); // Căn giữa header

      // Làm nổi bật cột "Tổng tiền" (cột 7)
      const totalColumn = sheet.getRange(1, 7, 1, 1);
      totalColumn.setBackground('#FF9800'); // Màu cam nổi bật
      totalColumn.setFontWeight('bold');

      // Freeze header row
      sheet.setFrozenRows(1);

      // Thiết lập độ rộng cột tối ưu để tránh scroll ngang
      sheet.setColumnWidth(1, 120);  // Thời gian
      sheet.setColumnWidth(2, 140);  // Mã đơn hàng
      sheet.setColumnWidth(3, 150);  // Tên khách hàng
      sheet.setColumnWidth(4, 120);  // Số điện thoại
      sheet.setColumnWidth(5, 250);  // Địa chỉ (rộng nhất)
      sheet.setColumnWidth(6, 80);   // Số lượng
      sheet.setColumnWidth(7, 100);  // Tổng tiền
      sheet.setColumnWidth(8, 120);  // Chữ trên túi
      sheet.setColumnWidth(9, 200);  // Ghi chú

      // Thiết lập chiều cao row mặc định
      sheet.setRowHeight(1, 40); // Header cao hơn

      console.log('✅ Google Script: Header created with optimized column widths');
    }
    
    // Chuẩn bị dữ liệu để ghi vào sheet
    const now = new Date();
    const timeString = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');
    
    const rowData = [
      timeString,                                    // Thời gian
      orderData.orderId || '',                       // Mã đơn hàng
      orderData.customer?.name || '',                // Tên khách hàng
      orderData.customer?.phone || '',               // Số điện thoại
      orderData.customer?.address || '',             // Địa chỉ
      orderData.cart?.[0]?.quantity || 1,            // Số lượng
      orderData.total || '',                         // Tổng tiền
      orderData.cart?.[0]?.notes || '',              // Chữ trên túi
      orderData.customer?.notes || ''                // Ghi chú
    ];
    
    // Ghi dữ liệu vào sheet
    console.log('💾 Google Script: Writing data to sheet...');
    console.log('📊 Google Script: Row data to write:', rowData);

    try {
      // Thêm dữ liệu vào sheet
      sheet.appendRow(rowData);

      // Lấy row vừa thêm để format
      const lastRow = sheet.getLastRow();

      // Căn giữa toàn bộ row dữ liệu (9 cột thay vì 10)
      const dataRowRange = sheet.getRange(lastRow, 1, 1, 9);
      dataRowRange.setHorizontalAlignment('center');
      dataRowRange.setVerticalAlignment('middle');

      // Format cột "Tổng tiền" (cột 7) - làm nổi bật
      const totalCell = sheet.getRange(lastRow, 7);
      totalCell.setBackground('#FFF3E0'); // Màu cam nhạt
      totalCell.setFontWeight('bold');
      totalCell.setFontColor('#E65100'); // Màu cam đậm
      totalCell.setHorizontalAlignment('center');



      // Format cột "Mã đơn hàng" (cột 2)
      const orderIdCell = sheet.getRange(lastRow, 2);
      orderIdCell.setFontFamily('Courier New'); // Font monospace
      orderIdCell.setFontWeight('bold');
      orderIdCell.setHorizontalAlignment('center');

      // Format cột "Địa chỉ" (cột 5) - căn trái vì text dài
      const addressCell = sheet.getRange(lastRow, 5);
      addressCell.setHorizontalAlignment('left');
      addressCell.setWrap(true); // Cho phép xuống dòng

      // Format cột "Ghi chú" (cột 9) - căn trái vì text dài
      const noteCell = sheet.getRange(lastRow, 9);
      noteCell.setHorizontalAlignment('left');
      noteCell.setWrap(true); // Cho phép xuống dòng

      // Thiết lập chiều cao row tự động cho dữ liệu dài
      sheet.setRowHeight(lastRow, 30); // Cao hơn mặc định để hiển thị tốt

      console.log('✅ Google Script: Data written to sheet successfully');
      console.log('📍 Google Script: New row added to sheet:', SHEET_NAME);
      console.log('🎨 Google Script: Formatting applied to row:', lastRow);

    } catch (error) {
      console.error('❌ Google Script: Error writing to sheet:', error);
      throw new Error('Không thể ghi dữ liệu vào sheet: ' + error.toString());
    }
    
    // Trả về response thành công
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Đơn hàng đã được lưu thành công',
        orderId: orderData.orderId,
        timestamp: timeString
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Google Script error:', error);
    
    // Trả về response lỗi
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Có lỗi xảy ra khi lưu đơn hàng',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm test để kiểm tra (không bắt buộc)
function testFunction() {
  const testData = {
    orderId: 'TEST123',
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      address: 'Hà Nội',
      notes: 'Giao hàng buổi sáng'
    },
    cart: [{
      quantity: 2,
      notes: 'Chữ: Lộc'
    }],
    total: '78,000đ'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
