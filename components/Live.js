import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";

class Live extends Component {
  state = {
    coords: null,
    status: null,
    direction: ""
  };
  render() {
    const { status, coords, direction } = this.state;

    // No permission set yet
    if (status === null) {
      return <ActivityIndicator style={{ marginTop: 30 }} />;
    }

    // Permission denied
    if (status === "denied") {
      return (
        <View>
          <Text>Denied</Text>
        </View>
      );
    }

    // Permission undetermined
    if (status === "undetermined") {
      return (
        <View>
          <Text>Undetermined</Text>
        </View>
      );
    }

    // Permission granted
    if (status === "granted") {
      return (
        <View>
          <Text>Live</Text>
          <Text>{JSON.stringify(this.state)}</Text>
        </View>
      );
    }

    return <div />;
  }
}

export default Live;
