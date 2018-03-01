import React from 'react';
import { View, Image } from 'react-native';
import { Container, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import { TabNavigator } from 'react-navigation';
import BookShelf from './pages/BookShelf';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';


class HomeScreen extends React.Component {
	// static navigationOptions = {
	// 	title: '书架',
	// 	headerRight: <Icon name='search' style={{ color: "#fff", marginRight: 15, fontSize: 24, }} />
	// };
	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;
		return {
			title: '书架',
			headerRight: <Icon name='search' onPress={() => {navigation.navigate("Search")}} style={{ color: "#fff", fontSize: 24, paddingLeft: 20, paddingRight: 20,}} />
		}
	};
	render() {
		return (
			<View style={{ flex: 1}}>
				<BookShelf></BookShelf>
			</View>
		);
	}
}

class SettingsScreen extends React.Component {
	static navigationOptions = {
		title: '找书',
	};
	render() {
		return (
			<Container>
				<Content>
					<List style={{ backgroundColor: "#fff" }}>
						<ListItem icon first onPress={() => { this.props.navigation.navigate('Rank') }}>
							<Left><Ionicons size={18} style={{ color: "#ea6f5a"}} name="chart-areaspline" /></Left>
							<Body><Text>排行榜</Text></Body>
							<Right><Icon name="arrow-forward" /></Right>
						</ListItem>
						<ListItem icon last onPress={() => { this.props.navigation.navigate('Category') }}>
							<Left><Ionicons size={18} style={{ color: "#32cd74" }} name="cube-unfolded" /></Left>
							<Body><Text>分类</Text></Body>
							<Right><Icon name="arrow-forward" /></Right>
						</ListItem>
					</List>
				</Content>
			</Container>
		);
	}
}

export default TabNavigator({
	Home: {
		screen: HomeScreen,
		navigationOptions: {
			tabBarLabel: '书架',
			tabBarIcon: ({ tintColor, focused }) => (
				<Ionicons
					name={focused ? 'book-open-page-variant' : 'book-open-page-variant'}
					size={26}
					style={{ color: tintColor }}
				/>
			),
		}
	},
	Settings: {
		screen: SettingsScreen,
		navigationOptions: {
			tabBarLabel: '找书',
			tabBarIcon: ({ tintColor, focused }) => (
				<Ionicons
					name={focused ? 'apple-safari' : 'apple-safari'}
					size={26}
					style={{ color: tintColor }}
				/>
			),
		}
	},
});