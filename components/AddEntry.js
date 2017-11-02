import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue
} from "../utils/helpers";
import DateHeader from "./DateHeader";
import UdaciSlider from "./UdaciSlider";
import UdaciStepper from "./UdaciStepper";
import TextButton from "./TextButton";
import { Ionicons } from "@expo/vector-icons";
import { removeEntry, submitEntry } from "../utils/api";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple } from "../utils/colors";
import { NavigationActions } from "react-navigation";

function SubmitButton({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.ioSubmitBtn : styles.androidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };

  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count
      };
    });
  };

  decrement = metric => {
    const { step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] - step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  };

  slide = (metric, value) => {
    this.setState(state => ({
      [metric]: value
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.props.dispatch(
      addEntry({
        [key]: entry
      })
    );

    // Update Redux
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }));

    // Navigate to home
    this.toHome();

    // Save to DB
    submitEntry({ entry, key });

    // Clear local notification
  };

  reset = () => {
    const key = timeToString();

    // Update Redux
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    );

    // Route to home
    this.toHome();

    // Update DB
    removeEntry({ key });
  };

  toHome = () => {
    this.props.navigation.dispatch(
      NavigationActions.back({
        key: "AddEntry"
      })
    );
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    console.log(this.props);

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-happy-outline" : "md-happy"}
            size={100}
          />
          <Text>You already logged your information for today</Text>
          {/* Whats inside of the "TextButton" tags will be in the "children" parameter of the "TextButton" component. */}
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <UdaciSlider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <UdaciStepper
                  value={value}
                  onIncrement={value => this.increment(key)}
                  onDecrement={value => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitButton onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  ioSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
    marginLeft: 30
  }
});

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined"
  };
}

export default connect(mapStateToProps)(AddEntry);
