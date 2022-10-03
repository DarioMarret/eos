import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

export const Network = async () => {
    const url = "https://www.google.com";
    const response = await axios.get({
        url: url,
        timeout: 1000,
    })
    console.log("response", response)
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
    // var estado = true
    // NetInfo.fetch().then(state => {
    //     console.log("state", state)
    //     console.log("Connection type", state.type);
    //     console.log("Is connected?", state.isConnected);
    //     console.log("Is offline?", state.isInternetReachable);
    //     console.log("\n");
    //     if(state.isConnected === true && state.isInternetReachable === true){
    //         estado = true
    //     }else{
    //         estado = false
    //     }
    // })
    // return estado
}