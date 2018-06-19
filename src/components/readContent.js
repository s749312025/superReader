import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Swiper from 'react-native-swiper';
import { backgroundColors, fontSizes, linHeights } from './readConfig';
var { height, width } = Dimensions.get('window');

class ReadContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// mark: {
			// 	index: 0,
			// 	markContent: ""
			// },
			initHeight: {maxHeight: 0},
			thisContent: "",
			getHeightText: "",
			thisPage: [],
			thisIndex: null,
			ViewStyle: {
				backgroundColor: backgroundColors[props.config[0]],
			},
			textStyle: {
				includeFontPadding: false,
				fontFamily: 'Cochin',
				fontSize: fontSizes[props.config[1]],
				lineHeight: linHeights[props.config[2]]
			}
		}
	}
	componentDidMount() {
		this.initHeight()
		this.initReadTxt(this.props.initContent.mark)
		// this.initReadTxt(this.props.initContent.initContent)
	}
	initReadTxt = async (mark) => {
		let content = await this.props.getContent(mark.index) 
		this.setState({ thisContent: content})
		this.setState({ getHeightText: content})
		// console.log(path);
		// let content = await RNFS.readFile(path)
		// this.setState({ thisContent: content})
		// this.setState({ getHeightText: content})
	}
	textOnLayout=(e) => {
		console.log(e.nativeEvent.layout)
	}
	_textOnLayout = (e) => {
		let page = []
		if(this.state.initHeight.maxHeight) {
			console.log(e.nativeEvent.layout.height, this.state.initHeight.maxHeight);
			thisPageTotal = Math.ceil(e.nativeEvent.layout.height / this.state.initHeight.maxHeight)
			for (let index = 0; index < thisPageTotal; index++) {
				page[index] = this.state.initHeight.maxHeight * index
			}
			this.setState({thisPage: page})
		}
		console.log(e.nativeEvent.layout)
	}
	initHeight = () => {
		console.log(this.props.config[2]);
		let num = Math.floor((height - 50) / linHeights[this.props.config[2]])
		this.setState({initHeight: {maxHeight: num * linHeights[this.props.config[2]]}})
	}
	
	render() {
		return (
			<View style={{flex: 1}}>
				{ this.state.thisContent && this.state.thisPage.length > 0 ? 
				<Swiper>
					{	
						this.state.thisPage.map((item, index) => 
							<View key={index} style={[styles.View, this.state.ViewStyle]}>
								<View style={[styles.TextView, this.state.initHeight]}>
									<Text allowFontScaling={false} style={[this.state.textStyle, {marginTop: -item}]} >{this.state.thisContent}</Text>
								</View>
							</View>
						)
					}
				</Swiper> : null }
				{
					this.state.getHeightText ? 
						<Text allowFontScaling={false} style={[{position: 'absolute', top: 20000, paddingLeft: 10}, this.state.textStyle]} 
						onLayout={this._textOnLayout}>{this.state.getHeightText}</Text>
						: null
				}
				
			</View>
		);
	}
}

export default ReadContent;

const styles = StyleSheet.create({
	View: {
		flex: 1,
		paddingTop: 20,
		paddingBottom: 30,
		paddingLeft: 10,
	},
	TextView: {
		overflow: 'hidden'
	},
	text: {
		// maxHeight: height-50,
		// marginTop: -(height-50),
		// overflow: 'hidden'
	}
});