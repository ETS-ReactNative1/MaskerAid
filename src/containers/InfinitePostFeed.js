/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, Text, Title, View} from 'react-native';
import {Post} from '../presentation';
import {ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
// Screen Dimensions
const {height, width} = Dimensions.get('window');

export default class InfinitePostFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      limit: 2,
      lastVisible: null,
      loading: false,
      refreshing: false,
      user: props.user,
      refresh: props.test,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.test != prevProps.test) {
      try {
        this.setState({
          documentData: [],
          lastVisible: null,
          loading: false,
          refreshing: false,
        });
        this.retrieveData(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  // Component Did Mount
  componentDidMount = () => {
    console.log(this.state.thingy);
    try {
      this.retrieveData(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Retrieve Data
  retrieveData = async (retrieveMore) => {
    try {
      if (!retrieveMore) {
        this.setState({
          loading: true,
        });
      } else {
        this.setState({
          refreshing: true,
        });
      }
      console.log('Retrieving Data');
      // Cloud Firestore: Query
      let initialQuery;

      if (!retrieveMore) {
        initialQuery = await firestore()
          .collection(
            this.state.userData
              ? `users/${this.state.user.uid}/posts`
              : 'posts',
          )
          .orderBy('post_date', 'desc')
          .limit(this.state.limit);
      } else {
        initialQuery = await firestore()
          .collection(
            this.state.userData
              ? `users/${this.state.user.uid}/posts`
              : 'posts',
          )
          .orderBy('post_date', 'desc')
          .startAfter(this.state.lastVisible)
          .limit(this.state.limit);
      }
      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();
      // Cloud Firestore: Document Data
      let documentData = [];
      documentSnapshots.forEach((postSnapshot) => {
        documentData.push({
          key: postSnapshot.data().post_date,
          post: postSnapshot.data(),
          user: postSnapshot.data().user,
          ref: postSnapshot.ref,
        });
      });

      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      let lastVisible = documentData[documentData.length - 1].key;
      // Set State

      if (!retrieveMore) {
        this.setState({
          documentData: documentData,
          lastVisible: lastVisible,
          loading: false,
        });
      } else {
        this.setState({
          documentData: [...this.state.documentData, ...documentData],
          lastVisible: lastVisible,
          refreshing: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Retrieve More Data
  retrieveMore = async () => {
    this.retrieveData(true);
  };

  // Render Header
  renderHeader = () => {
    try {
      return <Text style={styles.headerText}>Posts</Text>;
    } catch (error) {
      console.log(error);
    }
  };
  // Render Footer
  renderFooter = () => {
    try {
      // Check If Loading
      if (this.state.loading) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <FlatList
        // Data
        data={this.state.documentData}
        // Render Items
        renderItem={(item) => {
          return (
            <Post
              post={item.item.post}
              user={item.item.user}
              loc={item.item.ref}
            />
          );
        }}
        // Item Key
        keyExtractor={(item, index) => String(index)}
        // Header (Title)
        ListHeaderComponent={this.renderHeader}
        // Footer (Activity Indicator)
        ListFooterComponent={this.renderFooter}
        // On End Reached (Takes a function)
        onEndReached={this.retrieveMore}
        // How Close To The End Of List Until Next Data Request Is Made
        onEndReachedThreshold={0}
        // Refreshing (Set To True When End Reached)
        refreshing={this.state.refreshing}
      />
    );
  }
}
// Styles
const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  headerText: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
    marginBottom: 12,
  },
  itemContainer: {
    height: 80,
    width: width,
    borderWidth: 0.2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
});
