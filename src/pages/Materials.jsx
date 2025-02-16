import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router";

const ExcelUploader = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });

            // Assuming the first sheet is the one to read
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData);
        };
    };

    console.log(data);

    const handleUpload = async () => {
        try {
            const response = await axios.put("http://localhost:8000/api/v0/user-objects", {"object":{"items": data}}, {
                headers: { "Content-Type": "application/json" }
            });
            console.log("Upload Success:", response.data);
        } catch (error) {
            console.error("Upload Error:", error);
        }
    };

    return (
        <>
            <div className="text-xl font-bold">
                <h1>Material Excel Uploader</h1>
            </div>
            <div className="flex justify-between mx-10 p-5">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <div className="flex gap-x-5">
                    <button className="bg-blue-600 px-3 py-2 text-white rounded-xl" onClick={handleUpload} disabled={data.length === 0}>Upload</button>
                    <button 
                        className="bg-blue-600 px-3 py-2 text-white rounded-xl" 
                        onClick={() => navigate('/material')} 
                        >
  Check Materials
</button>
                </div>
            </div>
        </>
    );
};

export default ExcelUploader;