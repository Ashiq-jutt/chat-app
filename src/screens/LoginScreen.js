import {
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backendURL } from "../config/ip";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    // useEffect(() => {
    //     const checkLoginStatus = async () => {
    //         try {
    //             const token = await AsyncStorage.getItem("authToken");

    //             if (token) {
    //                 navigation.replace("Home");
    //             } else {
    //                 // token not found , show the login screen itself
    //             }
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     };

    //     checkLoginStatus();
    // }, []);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password,
        };

        axios
            .post(`${backendURL}/login`, user)
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                AsyncStorage.setItem("authToken", token);

                navigation.replace("Home");
            })
            .catch((error) => {
                Alert.alert("Login Error", "Invalid email or password");
                console.log("Login Error", error);
            });
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Sign In</Text>
                    <Text style={styles.subHeaderText}>Sign In to Your Account</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.formField}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={styles.input}
                            placeholderTextColor="black"
                            placeholder="Enter Your Email"
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            style={styles.input}
                            placeholderTextColor="black"
                            placeholder="Password"
                        />
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        style={styles.loginButton}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("Register")}
                        style={styles.signUpLink}
                    >
                        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
    },
    header: {
        marginTop: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        color: "#4A55A2",
        fontSize: 17,
        fontWeight: "600",
    },
    subHeaderText: {
        fontSize: 17,
        fontWeight: "600",
        marginTop: 15,
    },
    formContainer: {
        marginTop: 50,
    },
    formField: {
        marginTop: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        color: "gray",
    },
    input: {
        fontSize: 18,
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        marginVertical: 10,
        width: 300,
    },
    loginButton: {
        width: 200,
        backgroundColor: "#4A55A2",
        padding: 15,
        marginTop: 50,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    signUpLink: {
        marginTop: 15,
    },
    signUpText: {
        textAlign: "center",
        color: "gray",
        fontSize: 16,
    },
});

export default LoginScreen;
