import 'react-native-gesture-handler';
import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {FriendsContext} from './FriendsContext';
import HomeScreen from './HomeScreen';
import FriendsScreen from './ItemsScreen';
import makeApolloClient from './apollo';
import gql from 'graphql-tag';

const Stack = createStackNavigator();
const client = makeApolloClient();

client
  .query({
    query: gql`
      query TestQuery {
        round(round_id: 1011261) {
          name
          type_id
          target
          has_table
        }
      }
    `,
  })
  .then((result) => console.log(result));
client
  .query({
    variables: {from: '2001-01-01', to: '2021-01-01'},
    query: gql`
      query TestQuery($from: Date!, $to: Date!) {
        calendar(filters: {start_date_range: {from: $from, to: $to}}) {
          paginatorInfo {
            count
          }
          data {
            tournament_id
            series_id
            number
            team1 {
              team_id
            }
            team2 {
              team_id
              short_name
              logo
            }
            gf
            ga
            gfp
            gap
            stadium_id
            start_dt
          }
        }
      }
    `,
  })
  .then((calendar) => console.log(calendar));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleFriends: ['A', 'B', 'S'],
      currentFriends: [],
    };
  }

  getDate = (year, month, date) => {
    const d = new Date(year, month, date);
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    const resultDate = `${da}-${mo}-${ye}`;
    console.log(resultDate);
  };

  getCalendar = () => {
    let result;
    let from = '2001-01-01';
    let to = '2021-01-01';
    client
      .query({
        query: gql`
          query CalendarQuery($from: String, $to: String) {
            calendar(filters: {start_date_range: {from: $from, to: $to}}) {
              paginatorInfo {
                count
              }
              data {
                tournament_id
                series_id
                number
                team1 {
                  team_id
                }
                team2 {
                  team_id
                  short_name
                  logo
                }
                gf
                ga
                gfp
                gap
                stadium_id
                start_dt
              }
            }
          }
        `,
      })
      .then((calendar) => (result = calendar));

    return result;
  };

  addFriend = (index) => {
    const {currentFriends, possibleFriends} = this.state;
    const client = makeApolloClient();
    // Pull friend out of possibleFriends
    const addedFriend = possibleFriends.splice(index, 1);

    // And put friend in currentFriends
    currentFriends.push(addedFriend);

    // Finally, update the app state
    this.setState({
      currentFriends,
      possibleFriends,
    });
  };

  render() {
    return (
      <FriendsContext.Provider
        value={{
          currentFriends: this.state.currentFriends,
          possibleFriends: this.state.possibleFriends,
          addFriend: this.addFriend,
        }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Friends" component={FriendsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FriendsContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
