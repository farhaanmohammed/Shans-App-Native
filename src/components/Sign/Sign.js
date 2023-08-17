import React, { useRef } from "react";
import { StyleSheet, View, Button } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import sendSignatureToAPI from "../../api/Signature/sendSignatureToAPI";
import { useNavigation } from "@react-navigation/native";


const Sign = ({ onOK }) => {
  const navigation = useNavigation()
  const ref = useRef();

 
const handleOK = (signature) => {
  const path = FileSystem.cacheDirectory + `sign_${Date.now()}.png`;
  FileSystem.writeAsStringAsync(
    path,
    signature.replace("data:image/png;base64,", ""),
    { encoding: FileSystem.EncodingType.Base64 }
  )
  .then(async() => {
    console.log("path in sign js " , path)
   
    sendSignatureToAPI(path, navigation)
 
  } )
    .then(console.log)

    .catch(console.error);
};

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <View style={styles.container}>
      <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
      <View style={styles.row}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
};

export default Sign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});