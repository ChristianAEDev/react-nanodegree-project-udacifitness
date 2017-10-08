import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import DateHeader from './DateHeader';
import Slider from './Slider';
import Stepper from './Stepper';

export default class AddEntry extends Component {

  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] - step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }

  slide = (metric, value) => {
    this.setState((state) => ({
      [metric]: value,
    }))
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    return (
      <View>
        <DateHeader date={(new Date).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key}>
              {getIcon()}
              {
                type === 'slider' ?
                  <Slider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest} />
                  :
                  <Stepper
                    value={value}
                    onIncrement={(value) => this.increment(key)}
                    onDecrement={(value) => this.decrement(key)}
                    {...rest} />
              }
            </View>
          )
        })}
      </View>
    )
  }
}