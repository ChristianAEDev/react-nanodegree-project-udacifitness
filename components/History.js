import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { receiveEntries, addEntry } from "../actions";
import { timeToString, getDailyReminderValue } from "../utils/helpers";
import { fetchCalendarResults } from "../utils/api";

class History extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    // Dispatch is used to initiate a call to react-redux
    fetchCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        // If no data has been added for the given day
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue()
            })
          );
        }
      });
  }
  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.props)}</Text>
      </View>
    );
  }
}

function mapStateToProps(entries) {
  return { entries };
}

export default connect(mapStateToProps)(History);
