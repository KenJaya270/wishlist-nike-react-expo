import { useThemeContext } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f5f5f5" },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: isDark ? "#1E1E1E" : "#fff" },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={80}
            color={isDark ? "#fff" : "#007AFF"}
          />
          <Text
            style={[
              styles.title,
              { color: isDark ? "#fff" : "#222" },
            ]}
          >
            About This App
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#aaa" : "#555" },
            ]}
          >
            Built with ❤️ using React Native & Expo
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#fff" : "#222" },
            ]}
          >
            👋 Hello there!
          </Text>
          <Text
            style={[
              styles.paragraph,
              { color: isDark ? "#bbb" : "#444" },
            ]}
          >
            This mobile application was created as part of a learning project
            using React Native and Expo framework. It demonstrates the use of
            state management, navigation, image picker, and theming support
            (dark/light mode).
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#fff" : "#222" },
            ]}
          >
            🧑‍💻 Developer Info
          </Text>
          <Text
            style={[
              styles.paragraph,
              { color: isDark ? "#bbb" : "#444" },
            ]}
          >
            Developer: <Text style={{ fontWeight: "600" }}>Ken Jayakusuma</Text>
            {"\n"}Framework: Expo (React Native)
            {"\n"}Version: 1.0.0
          </Text>

  
          <Text
            style={[
              styles.footerText,
              { color: isDark ? "#777" : "#777" },
            ]}
          >
            © 2025 Ken Jayakusuma. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 40,
    marginBottom: 10,
  },
});
