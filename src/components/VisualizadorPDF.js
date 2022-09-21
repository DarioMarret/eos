import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native'
import PDFReader from 'rn-pdf-reader-js'


export default function VisualizadorPDF(props) {
    const { url, setPdfview, setPdfurl } = props;

    const source = { base64: `data:application/pdf;base64,${url}`, cache: true };
    function Volver(){
        setPdfview(true);
        setPdfurl("");
    }
    return (
        <>
            <PDFReader
                source={source}
                withScroll={true}
                withPinchZoom={true}
                withHorizontalScroll={true}
                // useGoogleReader={true}
            />
            <View
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 50,
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            >
                <TouchableOpacity
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#FF6B00',

                    }}
                    onPress={Volver}
                >
                    <Text
                        style={{
                            color: '#FFF',
                            fontSize: 18,
                            fontWeight: 'bold',

                        }}
                    >Volver</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})