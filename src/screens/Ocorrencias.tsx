import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet , Text, View } from "react-native";


export default function Ocorrencias(){
    return(
        <View style={styles.conteiner}>
            <Text style={styles.title}>Login</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    conteiner:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'

    },
    title:{
        fontSize: 22,
        fontWeight: 'bold'
    }
})


