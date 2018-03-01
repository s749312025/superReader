import React, { Component } from 'react';
import { View,  } from 'react-native';
import { Container, Text, Content, Body } from 'native-base';

import BookList from '../components/booklist';

class Books extends Component {
	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;
		return {
			title: params.title
		}
	};
	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state;
		let booksParams = {
			isLoading: params.isLoading ? true : false,
			url: params.url
		};
		this.state = booksParams
		console.log(params, params.isLoading ? true : false, this.state);
	}
	
	render() {
		return (
			<Container>
				{/* <View style={{backgroundColor: "red", flex: 1,}}></View> */}
				<BookList loading={this.state}></BookList>
			</Container>
		);
	}
}

export default Books;
