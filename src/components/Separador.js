import { StyleSheet, View } from "react-native";


export default function Separador() {
  return (
    <View style={styles.separador}>
    </View>
  );
}

const styles = StyleSheet.create({
    separador: {
        width: "100%",
        borderBottomColor: '#CECECA',
        borderBottomWidth: 1,
    },
});