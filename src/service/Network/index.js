import NetInfo from '@react-native-community/netinfo';

export const Network = async () => {
    var estado = true
    NetInfo.fetch().then(state => {
        console.log("state", state)
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        console.log("Is offline?", state.isInternetReachable);
        console.log("\n");
        if(state.isConnected === true && state.isInternetReachable === true){
            estado = true
        }else{
            estado = false
        }
    })
    return estado
}