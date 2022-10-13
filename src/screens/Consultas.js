import TabNavigator from "../navigation/TabNavigation";
import { upContext } from "../context/upContext";

export default function Consultas(props) {
    const { navigation } = props;

    console.log(navigation)
    return (
        // <upContext.Provider >
            <TabNavigator />
        // </upContext.Provider>
    );
}