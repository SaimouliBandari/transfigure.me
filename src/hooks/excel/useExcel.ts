import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

export function useExcel(excelBase64?: string){

    const [sheetNames, setSheetNames] = useState<string[]|null>(null);
       
    function convertSheetToJson(worksheets:XLSX.WorkBook){
        const convertedData: Record<string,any> = {};   
        console.log(worksheets.SheetNames);

        setSheetNames(worksheets.SheetNames);
         
        for (const sheet of worksheets.SheetNames) {
            convertedData[sheet] = XLSX.utils.sheet_to_json(worksheets.Sheets[sheet]);
        }

        console.log(convertedData);
        
        return convertedData;
    }

    function read(excel:string){
       const excelFile = XLSX.read(excel);
       return convertSheetToJson(excelFile);
    }

    return {
        read,
        sheetNames
    }
}