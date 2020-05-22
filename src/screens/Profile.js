import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {withNavigation} from 'react-navigation';
import {PostFeed} from '../containers';
import {ProgressBar, Colors, Button} from 'react-native-paper';

var width = Dimensions.get('window').width;

class Profile extends Component {
  static contextType = AuthContext;
  static data = PostFeed;

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
    };
  }

  segmentClicked = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  renderSectionOne = () => {
    return (
      <TouchableOpacity>
        <View
          style={[{width: width / 3}, {height: width / 3}, {marginBottom: 2}]}>
          <PostFeed userData={this.state.user} />
        </View>
      </TouchableOpacity>
    );
  };

  renderSection = () => {
    const {user, logout} = this.context;
    if (this.state.activeIndex == 0) {
      return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {this.renderSectionOne()}
        </View>
      );
    } else if (this.state.activeIndex == 1) {
      return (
        <View>
          <View>
            <PostFeed userData={user} />
          </View>
        </View>
      );
    }
  };

  render() {
    const {user, logout} = this.context;
    return (
      <View>
        <View>
          <View>
            <Button icon="logout" mode="contained" onPress={() => logout()}>
              Logout
            </Button>
            <Image
              style={styles.userPic}
              source={{uri: user.photoURL}}
              resizeMode="stretch"
            />
            <Text style={styles.userName}>{user.displayName}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.userStatus}>20</Text>
              <Text>Posts</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.userStatus}>20</Text>
              <Text>Following</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.userStatus}>20</Text>
              <Text>Followers</Text>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
              borderTopWidth: 0.75,
              borderTopColor: 'black',
            }}>
            <TouchableOpacity
              onPress={() => this.segmentClicked(0)}
              active={this.state.activeIndex == 0}>
              <Ionicons
                name={'md-apps'}
                size={30}
                style={[this.state.activeIndex == 0 ? {} : {color: 'grey'}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.segmentClicked(1)}
              active={this.state.activeIndex == 1}>
              <Ionicons
                name={'ios-list'}
                size={30}
                style={[this.state.activeIndex == 1 ? {} : {color: 'grey'}]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderSection()}
      </View>
    );
  }
}

export default withNavigation(Profile);

const styles = StyleSheet.create({
  userPic: {
    alignSelf: 'center',
    width: 125,
    height: 125,
    borderRadius: 75,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'black',
  },

  userName: {
    alignSelf: 'center',
    fontSize: 25,
    marginTop: 15,
    marginBottom: 20,
  },

  userStatus: {
    alignSelf: 'center',
    fontSize: 20,
  },
});