import React, { Component } from 'react';
import { View, Text,  } from 'react-native';

class ReadContent extends Component {
	constructor(props) {
		super(props);
		console.log(this.props)
	}
	
	render() {
		return (
			<View>
				<Text> {this.props.initContent} </Text>
			</View>
		);
	}
}

export default ReadContent;
