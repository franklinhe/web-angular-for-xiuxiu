import { EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';

export interface Sheet {
  index: number,
  header: number
};

export class ExcelService {
  // 导出
  static export(data: any) {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const ws2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');

    console.log(wb)
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

  // 导入
  static import(file: any, sheets: Sheet[]) {
    let event = new EventEmitter();
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      let result = [];
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      sheets.forEach(sheet => {
        /* grab first sheet */
        const wsname: string = wb.SheetNames[sheet.index];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        result.push(XLSX.utils.sheet_to_json(ws, { header: sheet.header }));
      })
      event.emit(result);
    };
    reader.readAsBinaryString(file);
    return event;
  }

}
