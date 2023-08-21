import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { baseUrl } from '../const';


const sendSignatureToAPI = async (fileUri, navigation) => {
  console.log("88888888888888888888888-=======================================================================8888888887777777")
  console.log(fileUri)
 
  try {
      const apiUrl = `${baseUrl}/fileupload`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const formData = new FormData();
      const contentType = 'image/png';

      formData.append('file', {
        uri: fileUri,
        type: contentType,
        name: fileInfo.uri.split('/').pop(),
      });

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadUrl = response.data.data;
      if (uploadUrl) {

        navigation.navigate('NewCollection', { uploadUrl: uploadUrl });
      }
      console.log('API response----1:', response.data.data);
  

    // Handle the API response as needed
  } catch (error) {
    console.log('API error---sendSignaturetoApi:', error);
    if (error.response) {
      console.log('Error response data:', error.response);
      // console.log('Error response status:', error.response.status);
      // console.log('Error response headers:', error.response.headers);
    } else if (error.request) {
      // console.log('No response received:', error.request);
    } else {
      // console.log('Error message:', error.message);
    }
    // Handle the error
  }
};

export default sendSignatureToAPI;
