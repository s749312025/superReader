import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'

import { allReducers } from './data/reducers/allReducers';

const store = createStore(allReducers, compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : f => f
))
import './Storage';
import TabNavigator from './tabNav'
import Home from './Home';

import RNFS from 'react-native-fs';

import {
	View,
	Text,
	StyleSheet,
	StatusBar
} from 'react-native'


export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					<StatusBar
						backgroundColor="blue"
						barStyle="light-content"
					/>
					<Home></Home>
				</View>
			</Provider>
		)
	}
}

const style = StyleSheet.create({

})