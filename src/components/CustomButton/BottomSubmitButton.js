import { View, Text, StyleSheet, TouchableOpacity} from "react-native";


export const BottomSubmitButton = ({ title, onPress }) => {
    return (
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.submitButtonContent}>
            <Text style={styles.submitButtonTitle}>{title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    submitButtonContent: {
        padding: 10,
        alignItems: "center",
        backgroundColor: "#ffa600",
        borderRadius: 13,
        marginHorizontal: 10
      },
      submitButtonTitle: {
        fontSize: 15,
        color: "white"
      },
      submitButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
      },
  })