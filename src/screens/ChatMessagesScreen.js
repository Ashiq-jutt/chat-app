import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Image,
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { backendURL } from "../config/ip";
import axios from "axios"
import { mvs } from "../config/metrices";
const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const { recepientId } = route.params;
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(UserType);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollToBottom()
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false })
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };



    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `${backendURL}/messages/${userId}/${recepientId}`
            );

            if (response.status === 200) {
                setMessages(response.data);
            } else {
                console.log("error showing messages", response.status);
            }
        } catch (error) {
            console.log("error fetching messages", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                const response = await axios.get(`${backendURL}/user/${recepientId}`);
                setRecepientData(response.data);
            } catch (error) {
                console.log("error retrieving details", error);
            }
        };

        fetchRecepientData();
    }, []);
    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recepientId", recepientId);

            //if the message type is an image or a normal text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await axios.post(`${backendURL}/messages`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setMessage("");
                setSelectedImage("");

                fetchMessages();
            }
        } catch (error) {
            console.log("error in sending the message", error);
        }
    };


    console.log("messages", selectedMessages);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back"
                        size={24}
                        color="black"
                    />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    resizeMode: "cover",
                                }}
                                source={{ uri: recepientData?.image }}
                            />

                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                                {recepientData?.name}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () =>
                selectedMessages.length > 0 ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                        <Ionicons name="md-arrow-undo" size={24} color="black" />
                        <FontAwesome name="star" size={24} color="black" />
                        <MaterialIcons
                            onPress={() => deleteMessages(selectedMessages)}
                            name="delete"
                            size={24}
                            color="black"
                        />
                    </View>
                ) : null,
        });
    }, [recepientData, selectedMessages]);



    const deleteMessages = async (messageIds) => {
        try {
            const response = await axios.post(`${backendURL}/deleteMessages`, {
                messages: messageIds,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id))
                );

                fetchMessages();
            } else {
                console.log("error deleting messages", response.status);
            }
        } catch (error) {
            console.log("error deleting messages", error);
        }
    };

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            handleSend("image", result.uri);
        }
    };
    const handleSelectMessage = (message) => {
        //check if the message is already selected
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            );
        } else {
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    };
    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable
                                onPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId ? styles.messageContainer : styles.otherUserMessageContainer,
                                    isSelected && styles.selectedMessage,
                                ]}
                            >
                                <Text style={{ fontSize: 13, textAlign: isSelected ? "right" : "left" }}>
                                    {item?.message}
                                </Text>
                                <Text style={{ textAlign: "right", fontSize: 9, color: "gray", marginTop: mvs(5) }}>
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === "image") {
                        const baseUrl = "/Users/sujananand/Build/messenger-project/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + filename };
                        return (
                            <Pressable
                                key={index}
                                style={item?.senderId?._id === userId ? styles.imageContainer : styles.otherUserImageContainer}
                            >
                                <View>
                                    <Image
                                        source={source}
                                        style={{ width: mvs(200), height: mvs(200), borderRadius: 7 }}
                                    />
                                    <Text style={styles.timeText}>
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View style={[styles.inputContainer, { marginBottom: showEmojiSelector ? 0 : 25, }]}>
                <Entypo onPress={handleEmojiPress} style={styles.emojiButton} name="emoji-happy" size={24} color="gray" />
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={styles.textInput}
                    placeholder="Type Your message..."
                />
                <View style={styles.iconContainer}>
                    <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>
                <Pressable onPress={() => handleSend("text")} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
    },
    messageContainer: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
        padding: 8,
        maxWidth: "60%",
        borderRadius: 7,
        margin: 10,
    },
    otherUserMessageContainer: {
        alignSelf: "flex-start",
        backgroundColor: "white",
        padding: 8,
        margin: 10,
        borderRadius: 7,
        maxWidth: "60%",
    },
    selectedMessage: {
        width: "100%",
        backgroundColor: "#F0FFFF",
    },
    timeText: {
        textAlign: "right",
        fontSize: 9,
        position: "absolute",
        right: 10,
        bottom: 7,
        color: "white",
        marginTop: 5,
    },
    imageContainer: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
        padding: 8,
        maxWidth: "60%",
        borderRadius: 7,
        margin: 10,
    },
    otherUserImageContainer: {
        alignSelf: "flex-start",
        backgroundColor: "white",
        padding: 8,
        margin: 10,
        borderRadius: 7,
        maxWidth: "60%",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#dddddd",

    },
    emojiButton: {
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginHorizontal: 8,
    },
    sendButton: {
        backgroundColor: "#007bff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    sendButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});
