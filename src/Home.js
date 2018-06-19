import React, { Component } from 'react';
import { View, Text, StatusBar, Button } from 'react-native';
import {Icon } from 'native-base';
import { SafeAreaView, StackNavigator } from 'react-navigation'

import TabNavigator from './tabNav'
import Rank from './pages/Rank'
import RankDetails from './pages/RankDetails'
import BookDetails from './pages/BookDetails'
import Category from './pages/Category'
import Books from './pages/Books'
import Search from './pages/Search'
import Reader from './pages/Reader'


const Nav =  StackNavigator({
	Tab: {
		screen: TabNavigator
	},
	Rank: {
		screen: Rank,
	},
	RankDetails: {
		screen: RankDetails,
	},
	BookDetails: {
		screen: BookDetails,
	},
	Category: {
		screen: Category,
	},
	Books: {
		screen: Books,
	},
	Search: {
		screen: Search,
	},
	Reader: {
		screen: Reader,
	}
}, {
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#26a5ff',
		},
		headerTintColor: "#fff"
	}
});

class Home extends Component {
	componentDidMount() {
		// Storage.save({
		// 	key: 'readConfig',
		// 	data: {
		// 		config: [1, 1, 2]
		// 	}
		// })
		Storage.load({
			key: 'readConfig'
		}).then(res => {
			console.log(res);
		}).catch(err => {
			if(err.name = '"NotFoundError"') {
				Storage.save({
					key: 'readConfig',
					data: {
						config: [1, 1, 2]
					}
				})
			}
		})
	}
	render() {
		return (
			<Nav />
		);
	}
}

export default Home;
