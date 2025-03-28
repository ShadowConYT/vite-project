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

    console.log(data == 0);

    const handleUpload = async () => {

        if (data.length == 0) {
            alert("No data to upload!");
            return;
        }

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
        <div className="border-2 border-black rounded-xl shadow-xl p-3 my-5">
            <div className="text-xl font-bold pl-5">
                <h1>Material Excel Uploader</h1>
            </div>
            <div className="flex justify-between p-5">
                <input className="bg-gray-300 p-3 rounded-xl cursor-pointer" required type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <div className="flex gap-x-5">
                    <button 
                        disabled={data.length === 0}
                        className="bg-blue-600 px-3 py-2 text-white rounded-xl cursor-pointer hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed" 
                        onClick={handleUpload}>
                            Upload
                    </button>
                    <button
                        className="bg-blue-600 px-3 py-2 text-white rounded-xl cursor-pointer hover:bg-blue-800" 
                        onClick={() => navigate('/material')} 
                        >
                        Check Materials
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploader;