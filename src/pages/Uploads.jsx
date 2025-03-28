import { useEffect, useState, useCallback, useMemo } from 'react';
import { PlusCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { getShipmentDetails, loadShipmentDetails } from '../actions/shipmentAction';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { clearShipmentErrors } from '../slices/shipmentSlice';
import countryList from 'react-select-country-list';
import { useNavigate } from 'react-router';
import { logOutUser } from '../actions/userAction';
import Materials from './Materials';

const ShipmentTracker = () => {
  const [trackingNumbers, setTrackingNumbers] = useState([{
    id: 1,
    ref: '',
    mode_of_transport: '',
    plant: '',
    liner_name: 'maersk',
    origin_location: '',
    invoice_date: ''
  }]);
  
  const [excelData, setExcelData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [listFormData, setListFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changePage = (url) => {
    window.location.href = url;
  }

  const options = useMemo(() => countryList().getData(), []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shipments, shipmentError, shipmentErrors, isDownloadEmailSent } = useSelector((state) => state.shipment);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const carriers = useMemo(() => [
    { value: 'maersk', label: 'Maersk' },
    { value: 'dhl', label: 'DHL' },
    { value: 'geodis', label: 'Geodis' }
  ], []);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload a valid XLSX file');
      toast.error('Please upload a valid XLSX file');
      return;
    }

    setTrackingNumbers([]);
    setUploadedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workBook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workBook.SheetNames[0];
        const sheet = workBook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        console.log(sheetData);
        setExcelData(sheetData);
      } catch (err) {
        console.error("Error parsing excel file", err);
        setError('Error parsing the Excel file. Please ensure it is correctly formatted.');
        toast.error('Error parsing the Excel file. Please ensure it is correctly formatted.');
        setUploadedFile(null);
      }
    };

    reader.onerror = (err) => {
      console.error("Error reading file", err);
      setError('Error reading the file.');
      toast.error('Error reading the file.');
      setUploadedFile(null);
    }

    reader.readAsArrayBuffer(file);
  }, []);

  useEffect(() => {
    dispatch(loadShipmentDetails());
  }, [dispatch]);

  useEffect(() => {
    if (excelData) {
      const newApiFormData = excelData.map((content) => ({
        ref: content["HBL No"],
        liner_name: content["Liner"],
        origin_location: content["Origin Country"],
        mode_of_transport: content["MOT"].toLowerCase(),
        plant: content["Plant"],
        invoice_date: content["Invoice Date"]
      }));
      console.log(newApiFormData);
      setListFormData(newApiFormData);
    }

    if (shipmentError) {
      setError(shipmentError);
      toast.error(shipmentError);
    }

    if (shipmentErrors.length > 0) {
      shipmentErrors.forEach((error) => {
        const errMsg = `An error occurred while tracking ${error.ref}. Kindly check the tracking number, liner, and try again.`;
        toast.error(errMsg);
      });
      dispatch(clearShipmentErrors());
    }
  }, [excelData, shipmentError, shipmentErrors, dispatch]);

  useEffect(() => {
    if (isDownloadEmailSent) {
      toast.success('Email sent successfully');
      // dispatch(clearDownloadEmailSent());
    }
  }, [isDownloadEmailSent, dispatch]);

  const removeUploadedFile = useCallback(() => {
    setUploadedFile(null);
    setError(null);
    setExcelData(null);
    setListFormData([]);
  }, []);

  const handleInputChange = useCallback((id, field, value) => {
    setTrackingNumbers(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addTrackingNumber = useCallback(() => {
    setTrackingNumbers(prev => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(item => item.id)) + 1 : 1,
        ref: '',
        mode_of_transport: '',
        plant: '',
        liner_name: 'maersk',
        origin_location: '',
        invoice_date: ''
      }
    ]);
  }, []);

  const removeTrackingNumber = useCallback((id) => {
    setTrackingNumbers(prev => prev.filter(item => item.id !== id));
  }, []);

  const trackShipments = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let formData;

      if (uploadedFile && listFormData.length > 0) {
        formData = listFormData;
      } else {
        formData = trackingNumbers.map(item => ({
          ref: item.ref,
          liner_name: item.liner_name,
          origin_location: item.origin_location,
          mode_of_transport: item.mode_of_transport,
          plant: item.plant,
          invoice_date: item.invoice_date
        }));
      }

      await dispatch(getShipmentDetails(formData));
      await dispatch(loadShipmentDetails());
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message || 'An error occurred while tracking shipments');
      toast.error('An error occurred while tracking shipments');
    } finally {
      setLoading(false);
    }
  }, [uploadedFile, listFormData, trackingNumbers, dispatch]);

  const logOutHandler = () => {
    dispatch(logOutUser());
  }

  console.log(trackingNumbers)

  return (
    <div className="min-h-screen bg-gray-50 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto"> 
        <div className='flex justify-between items-center mb-4'>
          <div className="text-left mb-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipment Tracker</h1>
            <p className="text-gray-600">Track multiple shipments across different carriers</p>
          </div>
        </div>
        <Materials />
        <div className='border-2 border-black p-3 rounded-xl'>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div>
              <h1 className='font-bold text-xl mb-4'>HBL Tracker</h1>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload XLSX File (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {uploadedFile && (
                      <button
                        onClick={removeUploadedFile}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {trackingNumbers.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      value={item.ref}
                      onChange={(e) => handleInputChange(item.id, 'ref', e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!!uploadedFile}
                    />
                  </div>
                  <div>
                    <select
                      value={item.mode_of_transport}
                      onChange={(e) => handleInputChange(item.id, 'mode_of_transport', e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!!uploadedFile}
                    >
                      <option value="">Select MOT</option>
                      <option value="sea">Sea</option>
                      <option value="air">Air</option>
                    </select>
                  </div>
                  <div className='w-48'>
                    <input
                      type="text"
                      placeholder="Enter Plant"
                      value={item.plant}
                      onChange={(e) => handleInputChange(item.id, 'plant', e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!!uploadedFile}
                    />
                  </div>
                  <div className='w-48'>
                    <select
                      value={item.origin_location}
                      onChange={(e) => handleInputChange(item.id, 'origin_location', e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!!uploadedFile}
                    >
                      <option value="">Select Origin Location</option>
                      {options.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-48">
                    <select
                      value={item.liner_name}
                      onChange={(e) => handleInputChange(item.id, 'liner_name', e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!!uploadedFile}
                    >
                      {carriers.map((carrier) => (
                        <option key={carrier.value} value={carrier.value}>
                          {carrier.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='w-48'>
                    <input
                      type="date"
                      placeholder="Enter Invoice Date"
                      value={item.invoice_date}
                      onChange={(e) => handleInputChange(item.id, 'invoice_date', e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!!uploadedFile}
                    />
                  </div>
                  {trackingNumbers.length > 1 && !uploadedFile && (
                    <button
                      onClick={() => removeTrackingNumber(item.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className='p-5 float-right'>
              <Button className='!bg-blue-600 !text-white !font-normal hover:!bg-blue-700' onClick={trackShipments}>
                  Submit
              </Button> 
            </div>

            {!uploadedFile && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={addTrackingNumber}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Another Tracking Number
                </button>
              </div>
            )}
          </div>

          <div className='w-full flex justify-center'>
            <Button onClick={() => navigate('/live')} className='!w-48 !bg-blue-600 !text-white !p-2 !rounded-xl'>
              Check Live Status
            </Button>
            {/* <button onClick={() => logOutHandler()} className='w-48 bg-red-600 text-white  p-2 rounded-xl'>
              Logout
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;