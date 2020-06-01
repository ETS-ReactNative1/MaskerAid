import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {withNavigation} from 'react-navigation';
import {PostFeed} from '../containers';
import {Button} from 'react-native-paper';
import Fire from '../util/Fire';
import {AuthContext} from '../navigation/ContextProvider';
import firestore from '@react-native-firebase/firestore';
import * as RootNavigation from '../navigation/RootNavigation.js';

var width = Dimensions.get('window').width;

class Profile extends Component {
  static data = PostFeed;
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
      user: this.props.user
        ? {
            uid: this.props.user.uid,
            email: this.props.user.email,
            displayName: this.props.user.displayName,
            photoURL: this.props.user.photoURL,
          }
        : this.props.route.params.user,
      selfProfile: this.props.user ? true : false,
      following: false,
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
    };
  }

  updateFollowState = () => {
    const {user} = this.context;
    const snapshot = firestore()
      .collection('users')
      .where('uid', '==', user.uid)
      .where('_following', 'array-contains', this.state.user.uid)
      .get()
      .then(
        function (querySnapshot) {
          this.setState({following: !querySnapshot.empty});
        }.bind(this),
      )
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  };

  componentDidMount() {
    if (!this.state.selfProfile) {
      this.updateFollowState();
    }

    this.unsubscribe = firestore()
      .collection('users')
      .doc(this.state.user.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.data()) {
          this.setState({
            followerCount: snapshot.data().follower_count
              ? snapshot.data().follower_count
              : 0,
            followingCount: snapshot.data().following_count
              ? snapshot.data().following_count
              : 0,
            postCount: snapshot.data().post_count
              ? snapshot.data().post_count
              : 0,
          });
        }
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  segmentClicked = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  renderHeader = () => {
    const {theme} = this.context;

    return (
      <>
        <View>
          <View>
            {this.renderTopBar()}
            <Image
              style={styles.userPic}
              source={{uri: this.state.user.photoURL}}
              resizeMode="stretch"
            />
            <Text style={styles.userName}>{this.state.user.displayName}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.userStatus}>{this.state.postCount}</Text>
              <Text>Posts</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  RootNavigation.navigate('UserList', {
                    user: this.state.user,
                    listType: 'following',
                  });
                }}>
                <Text style={styles.userStatus}>
                  {this.state.followingCount}
                </Text>
                <Text>Following</Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  console.log(this.state.user);
                  RootNavigation.navigate('UserList', {
                    user: this.state.user,
                    listType: 'followers',
                  });
                }}>
                <Text style={styles.userStatus}>
                  {this.state.followerCount}
                </Text>
                <Text>Followers</Text>
              </TouchableOpacity>
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
                style={[
                  this.state.activeIndex == 0
                    ? {color: theme.primary}
                    : {color: 'grey'},
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.segmentClicked(1)}
              active={this.state.activeIndex == 1}>
              <Ionicons
                name={'ios-list'}
                size={30}
                style={[
                  this.state.activeIndex == 1
                    ? {
                        color: theme.primary,
                      }
                    : {color: 'grey'},
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  renderTopBar = () => {
    const {user, logout, deleteAccount, theme} = this.context;
    if (this.state.selfProfile) {
      return (
        <>
          <Button
            icon="logout"
            mode="contained"
            onPress={() => {
              Alert.alert(
                'Are you sure you want to logout?',
                'All your posts will be saved',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'OK', onPress: () => logout()},
                ],
                {cancelable: false},
              );
            }}>
            Logout
          </Button>
          <Button
            icon="trash-can-outline"
            mode="contained"
            onPress={() => {
              Alert.alert(
                'Are you sure you want to delete your account?',
                "There's no turning back",
                [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'OK', onPress: () => deleteAccount()},
                ],
                {cancelable: false},
              );
            }}>
            Delete Account
          </Button>
          <Button
            icon="settings"
            mode="contained"
            onPress={() => {
              this.props.navigation.navigate('Settings');
            }}>
            Settings
          </Button>
        </>
      );
    } else if (user.uid != this.state.user.uid) {
      return (
        <>
          <Button
            style={{
              backgroundColor: theme.colors.primary,
            }}
            icon="logout"
            mode="contained"
            onPress={() => {
              Fire.setFollowing(user, this.state.user, !this.state.following);
              this.updateFollowState();
            }}>
            {this.state.following ? 'Unfollow' : 'Follow'}
          </Button>
          <Button
            icon="logout"
            mode="contained"
            onPress={() => {
              this.props.navigation.navigate('Chat', {
                user: {
                  uid: this.state.user.uid,
                  photoURL: this.state.user.photoURL,
                  email: this.state.user.email,
                  displayName: this.state.user.displayName,
                },
              });
            }}>
            Message
          </Button>
        </>
      );
    }
  };

  renderSectionOne = () => {
    return (
      <TouchableOpacity>
        <View
          style={[{width: width / 3}, {height: width / 3}, {marginBottom: 2}]}>
          <PostFeed
            user={this.state.user}
            navigation={this.props.navigation}
            onHeader={() => {
              return this.renderHeader();
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderSection = () => {
    return (
      <PostFeed
        user={this.state.user}
        navigation={this.props.navigation}
        onHeader={() => {
          return this.renderHeader();
        }}
      />
    );
  };

  render() {
    return <View>{this.renderSection()}</View>;
  }
}

export default withNavigation(Profile);

const styles = StyleSheet.create({
  userPic: {
    alignSelf: 'center',
    width: 125,
    height: 125,
    marginTop: 20,
    borderRadius: 75,
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
