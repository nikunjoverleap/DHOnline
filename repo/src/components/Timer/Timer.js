import * as React from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import StyleSheetFactory from './TimerStyle';
import { colors } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { useTimer } from 'react-timer-hook';
import Block from '../Block';

function Timer({ navigation, expiryTimestamp }) {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  const { width } = Dimensions.get('window');
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  return isRunning ? (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <Block
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {days ? (
          <>
            <Block style={styles.timerBlockContainer} flex={false}>
              <Block style={styles.timerBlock} flex={false}>
                <Text style={styles.timerLabel}>{days}</Text>
              </Block>
              <Block>
                <Text style={styles.timerBlockLabel}>Days</Text>
              </Block>
            </Block>
            <Block flex={false}>
              <Text style={styles.timerBlockDivider}>:</Text>
            </Block>
          </>
        ) : null}

        <Block style={styles.timerBlockContainer} flex={false}>
          <Block style={styles.timerBlock} flex={false}>
            <Text style={styles.timerLabel}>{hours}</Text>
          </Block>
          <Block>
            <Text style={styles.timerBlockLabel}>Hours</Text>
          </Block>
        </Block>
        <Block flex={false}>
          <Text style={styles.timerBlockDivider}>:</Text>
        </Block>

        <Block style={styles.timerBlockContainer} flex={false}>
          <Block style={styles.timerBlock} flex={false}>
            <Text style={styles.timerLabel}>{minutes}</Text>
          </Block>
          <Block>
            <Text style={styles.timerBlockLabel}>Minutes</Text>
          </Block>
        </Block>
        <Block flex={false}>
          <Text style={styles.timerBlockDivider}>:</Text>
        </Block>

        <Block style={styles.timerBlockContainer} flex={false}>
          <Block style={styles.timerBlock} flex={false}>
            <Text style={styles.timerLabel}>{seconds}</Text>
          </Block>
          <Block>
            <Text style={styles.timerBlockLabel}>Seconds</Text>
          </Block>
        </Block>
      </Block>
    </SafeAreaView>
  ) : null;
}
export default Timer;
