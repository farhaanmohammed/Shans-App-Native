import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { baseUrl } from '../const';
import { useNavigation } from '@react-navigation/native';

const sendSignatureToAPI = async (fileUri, navigation) => {
  try {
    const apiUrl = `${baseUrl}/fileupload`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const formData = new FormData();
    const contentType = fileInfo.mimeType || 'image/png';

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
    navigation.navigate('NewCollection', { uploadUrl: uploadUrl });
    console.log('API response:', response.data.data);
    // Handle the API response as needed
  } catch (error) {
    console.error('API error:', error);
    if (error.response) {
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      console.log('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error message:', error.message);
    }
    // Handle the error
  }
};

export default sendSignatureToAPI;
