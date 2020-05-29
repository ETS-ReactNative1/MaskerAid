import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {SlidersColorPicker} from 'react-native-color';
import tinycolor from 'tinycolor2';
import {AuthContext} from '../navigation/AuthProvider';
import {withNavigation} from 'react-navigation';
import {YellowBox} from 'react-native';

class SettingsScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    modalVisible: false,
    recents: ['#247ba0', '#70c1b3', '#b2dbbf', '#f3ffbd', '#ff1654'],
    color: tinycolor('#70c1b3').toHsl(),
  };

  componentDidMount = () => {
    YellowBox.ignoreWarnings(['Animated:']);
    YellowBox.ignoreWarnings(['Warning: componentWill']);
    const {theme} = this.context;
    this.setState({color: theme.colors.primary});
  };

  updateHue = (h) => this.setState({color: {...this.state.color, h}});
  updateSaturation = (s) => this.setState({color: {...this.state.color, s}});
  updateLightness = (l) => this.setState({color: {...this.state.color, l}});

  render() {
    const {theme, changeTheme} = this.context;
    const overlayTextColor = tinycolor(this.state.color).isDark()
      ? '#FAFAFA'
      : '#222';
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            {backgroundColor: tinycolor(this.state.color).toHslString()},
          ]}></View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionText}>Background Color</Text>
          <TouchableOpacity
            onPress={() => this.setState({modalVisible: true})}
            style={[
              styles.colorPreview,
              {backgroundColor: tinycolor(this.state.color).toHslString()},
            ]}>
            <Text style={[styles.colorString, {color: overlayTextColor}]}>
              {tinycolor(this.state.color).toHexString()}
            </Text>
          </TouchableOpacity>

          <SlidersColorPicker
            visible={this.state.modalVisible}
            color={this.state.color}
            returnMode={'hex'}
            onCancel={() => this.setState({modalVisible: false})}
            onOk={(colorHex) => {
              this.setState({
                modalVisible: false,
                color: tinycolor(colorHex).toHsl(),
              });
              this.setState({
                recents: [
                  colorHex,
                  ...this.state.recents
                    .filter((c) => c !== colorHex)
                    .slice(0, 4),
                ],
              });
              changeTheme({
                ...theme,
                colors: {primary: colorHex},
                dark: false,
              });
            }}
            swatches={this.state.recents}
            swatchesLabel="RECENTS"
            okLabel="Done"
            cancelLabel="Cancel"
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: 16,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  headerText: {
    marginTop: 24,
    fontSize: 34,
    lineHeight: 41,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-bold',
      },
      ios: {
        fontWeight: '700',
        letterSpacing: 0.41,
      },
    }),
  },
  sectionText: {
    marginTop: 32,
    color: '#222',
    fontSize: 22,
    lineHeight: 28,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
      ios: {
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
  componentText: {
    marginTop: 16,
    color: '#222',
    fontSize: 16,
    lineHeight: 21,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
      ios: {
        fontWeight: '600',
        letterSpacing: -0.408,
      },
    }),
  },
  colorPreview: {
    marginLeft: 12,
    marginTop: 12,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 3,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.25,
  },
  gradient: {
    alignSelf: 'stretch',
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 16,
    height: 4,
  },
  sliderRow: {
    alignSelf: 'stretch',
    marginLeft: 12,
    marginTop: 12,
  },
  colorString: {
    fontSize: 34,
    lineHeight: 41,
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier New',
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
});

export default withNavigation(SettingsScreen);
