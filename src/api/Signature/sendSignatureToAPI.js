import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { baseUrl } from '../const';



const sendSignatureToAPI = async (fileUri) => {
  console.log("******====******", fileUri)
  try {
    const apiUrl = `${baseUrl}/fileupload`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const formData = new FormData();
    const contentType = fileInfo.mimeType || 'image/png';
    console.log("***file infooo***", fileInfo)

    formData.append('file', {
      uri: fileUri,
      type: contentType,
      name: fileInfo.uri.split('/').pop(),
    });
    console.log("formData", formData)
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('API response:', response.data);
    // Handle the API response as needed
  } catch (error) {
    console.error('API error:', error);
    console.log('Error details:', error.response);
    console.log('Error details:', error.message);
    // Handle the error
  }

};

export default sendSignatureToAPI