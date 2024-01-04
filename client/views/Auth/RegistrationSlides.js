import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { MyContext } from "../../providers/DataProvider";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const Slide1 = ({
  styles,
  getFirstName,
  setFirstName,
  getLastName,
  setLastName,
}) => {
  /*  First Name -- Last Name
   */
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.subHeaderWrapper}>
          Welcome! {"\n"}Let's get to know each other!
        </Text>
      </View>
      <View style={styles.labelWrapper}>
        <Text style={styles.textWrapper}>First Name</Text>
        <TextInput
          onChangeText={setFirstName}
          value={getFirstName}
          autoComplete="off"
          style={styles.input}
        />
      </View>
      <View style={styles.labelWrapper}>
        <Text style={styles.textWrapper}>Last Name</Text>
        <TextInput
          onChangeText={setLastName}
          value={getLastName}
          autoComplete="off"
          style={styles.input}
        />
      </View>
    </View>
  );
};

const Slide2 = ({
  styles,
  getUsername,
  setUsername,
  getPassword,
  setPassword,
}) => {
  /*  Username -- password
   */
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.subHeaderWrapper}>
          Enter your login credentials
        </Text>
      </View>
      <View style={styles.labelWrapper}>
        <Text style={styles.textWrapper}>Username</Text>
        <TextInput
          onChangeText={setUsername}
          value={getUsername}
          style={styles.input}
        />
      </View>
      <View style={styles.labelWrapper}>
        <Text style={styles.textWrapper}>Password</Text>
        <TextInput
          secureTextEntry={true}
          onChangeText={setPassword}
          value={getPassword}
          style={styles.input}
        />
      </View>
    </View>
  );
};

const Slide3 = ({
  styles,
  getEmail,
  setEmail,
  getPhoneNumber,
  setPhoneNumber,
}) => {
  const formatPhoneNumber = (input) => {
    // Implement your own logic to format the phone number
    // For example, you can add dashes after every third digit
    const formattedNumber = input
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    return formattedNumber;
  };

  const handlePhoneNumberChange = (input) => {
    const formattedNumber = formatPhoneNumber(input);
    setPhoneNumber(formattedNumber);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.subHeaderWrapper}>
          Almost there...{"\n"}Enter contact details
        </Text>
      </View>
      <View style={styles.labelWrapper}>
        <Text style={styles.textWrapper}>Email</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={getEmail}
          style={styles.input}
        />
      </View>
      <View style={styles.labelWrapper}>
        <Text style={styles.textWrapper}>Phone Number</Text>
        <TextInput
          onChangeText={handlePhoneNumberChange}
          value={getPhoneNumber}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

const Slide4 = ({ styles, getProfilePicture, setProfilePicture }) => {
  const pickImage = React.useCallback((type, options) => {
    if (type === "capture") {
      launchCamera(options, handleImageSelection);
    } else {
      launchImageLibrary(options, handleImageSelection);
    }
  }, []);

  const handleImageSelection = (selectedImage) => {
    const imageJson = {
      assets: [{ uri: selectedImage.uri }],
    };
    setProfilePicture(imageJson);
  };

  const renderContent = () => {
    if (getProfilePicture?.assets && getProfilePicture.assets.length > 0) {
      // If an image is selected, render the image
      const selectedImage = getProfilePicture.assets[0];

      return (
        <TouchableOpacity
          onPress={pickImage}
          style={styles.profilePicInput}
          key={selectedImage.uri}
        >
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={styles.image}
            source={{ uri: selectedImage.uri }}
          />
        </TouchableOpacity>
      );
    } else {
      // If no image is selected, render the text and allow selecting an image
      return (
        <TouchableOpacity
          onPress={() => pickImage("library")}
          style={styles.profilePicInput}
        >
          <Text style={styles.textWrapper}>Upload Image</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.subHeaderWrapper}>Upload profile picture</Text>
      </View>
      <View style={styles.profilePictureLabelWrapper}>{renderContent()}</View>
    </View>
  );
};

const RegistrationSlides = ({
  item,
  colors,
  fonts,
  windowWidth,
  windowHeight,
  getFirstName,
  setFirstName,
  getLastName,
  setLastName,
  getUsername,
  setUsername,
  getPassword,
  setPassword,
  getEmail,
  setEmail,
  getPhoneNumber,
  setPhoneNumber,
  getProfilePicture,
  setProfilePicture,
}) => {
  const styles = getStyles({ fonts, colors, windowWidth, windowHeight });

  switch (item.id) {
    case "1":
      return (
        <Slide1
          styles={styles}
          getFirstName={getFirstName}
          setFirstName={setFirstName}
          getLastName={getLastName}
          setLastName={setLastName}
        />
      );
    case "2":
      return (
        <Slide2
          styles={styles}
          getUsername={getUsername}
          setUsername={setUsername}
          getPassword={getPassword}
          setPassword={setPassword}
        />
      );
    case "3":
      return (
        <Slide3
          styles={styles}
          getEmail={getEmail}
          setEmail={setEmail}
          getPhoneNumber={getPhoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      );
    case "4":
      return (
        <Slide4
          styles={styles}
          getProfilePicture={getProfilePicture}
          setProfilePicture={setProfilePicture}
        />
      );
  }
};

const getStyles = ({ windowHeight, windowWidth, colors, fonts }) =>
  StyleSheet.create({
    container: {
      gap: 24,
      width: windowWidth * 0.7,
    },
    headerContainer: {
      height: "30%",
      alignItems: "center",
      justifyContent: "center",
    },

    labelWrapper: {
      height: "25%",
      gap: 12,
      paddingHorizontal: 32,
    },
    profilePictureLabelWrapper: {
      height: "55%",
      paddingHorizontal: 32,
      alignItems: "center",
      justifyContent: "center",
    },

    textWrapper: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 12,
      color: colors.onPrimary,
    },
    subHeaderWrapper: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 13,
      color: colors.onPrimary,
    },
    buttontextWrapper: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 14,
      fontWeight: "bold",
      color: colors.onPrimary,
    },

    input: {
      height: "30%",
      backgroundColor: colors.background,
      borderRadius: 12,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 12,
      padding: 16,
    },

    profilePicInput: {
      height: 150,
      width: 150,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#303030",
      borderRadius: 120,
      overflow: "hidden",
      color: colors.onPrimary,
    },
    loginButton: {
      height: "15%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "hsla(272, 100%, 10%, 1)",
      borderRadius: 25,
    },
    image: {
      width: 150,
      height: 150,
    },
  });

export default RegistrationSlides;
