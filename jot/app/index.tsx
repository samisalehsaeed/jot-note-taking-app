import { View, Text } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "green" }}>
        ✅ App is working!
      </Text>
    </View>
  );
}
