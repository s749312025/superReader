import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Swiper from 'react-native-swiper';
var { height, width } = Dimensions.get('window');

class ReadContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mark: {
				index: 0,
				markContent: ""
			},
			thisContent: "",
			thisIndex: null,
		}
	}
	componentDidMount() {
		let lineWidth = Math.floor((width - 40) * 2 / 18);
		console.log({ lineWidth, width});
		this.readTxt(this.props.initContent.initContent)
	}
	readTxt = async (path) => {
		console.log(path);
		let content = await RNFS.readFile(path)
		console.log(content);
		this.setState({ thisContent: content})
	}
	textOnLayout=(e) => {
		console.log(e.nativeEvent.layout)
	}
	_textOnLayout = (e) => {
		console.log(e.nativeEvent.layout)
	}
	
	render() {
		return (
			<View style={{flex: 1, backgroundColor: "#fff"}}>
				<Text style={[styles.readTextConfig, { position: "absolute" }]} onLayout={this._textOnLayout}>{this.state.thisContent}</Text>
				<Text style={styles.readTextConfig} onLayout={this.textOnLayout}>{this.state.thisContent}</Text>
				{/* <Swiper style={styles.backgroundColor}>
					<View style={styles.backgroundColor}><Text style={styles.backgroundColor}>123</Text></View>
					<View><Text>456</Text></View>
					<View><Text>789</Text></View>
				</Swiper> */}
			</View>
		);
	}
}

export default ReadContent;

const styles = StyleSheet.create({
	readBackground: {
		backgroundColor: "#cfbfae",
		flex: 1
	},
	readTextConfig: {
		fontSize: 18,
		lineHeight: 24
	}
});