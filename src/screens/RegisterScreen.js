import {
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { backendURL } from "../config/ip";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const navigation = useNavigation();
    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            image: image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWje_gjVcmi-wks5nTRnW_xv5W2l3MVnk7W1QDcZuhNg&s',
            freindRequests: [],
            friends: [],
            sentFriendRequests: []
        };

        // send a POST  request to the backend API to register the user
        // Replace with the actual IP address of the backend server
        axios.post(`${backendURL}/register`, user)
            .then((response) => {
                console.log(response);

                Alert.alert(
                    "Registration successful",
                    "You have been registered Successfully"
                );
                setName("");
                setEmail("");
                setPassword("");
                setImage("");
            })
            .catch((error) => {
                Alert.alert(
                    "Registration Error",
                    "An error occurred while registering"
                );
                console.log("registration failed", error);
            });
    };
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Register</Text>
                    <Text style={styles.subHeaderText}>Register To Your Account</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.formField}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={styles.input}
                            placeholderTextColor="black"
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={styles.input}
                            placeholderTextColor="black"
                            placeholder="Enter your email"
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

                    <View style={styles.formField}>
                        <Text style={styles.label}>Image</Text>
                        <TextInput
                            value={image}
                            onChangeText={(text) => setImage(text)}
                            style={styles.input}
                            placeholderTextColor="black"
                            placeholder="Image URL"
                        />
                    </View>

                    <Pressable
                        onPress={() => handleRegister()}
                        style={styles.registerButton}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.goBack()} style={styles.signInLink}>
                        <Text style={styles.signInText}>Already Have an Account? Sign in</Text>
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
    registerButton: {
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
    signInLink: {
        marginTop: 15,
    },
    signInText: {
        textAlign: "center",
        color: "gray",
        fontSize: 16,
    },
});

export default RegisterScreen;
