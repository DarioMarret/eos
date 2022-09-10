import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getInfoUserLocal } from "../../service/usuario";
import BannerFooter from "../../components/BannerFooter";

export default function TicketsOS(props) {
    return (
        <View style={styles.container} >
            <Text>TicketsOS</Text>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        elevation: 5,
    },
    formItem: {
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});