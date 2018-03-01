import React, { Component } from 'react';
import { StyleSheet, Image, Alert } from 'react-native';
import { Container, Header, Content, List, Icon, Left, Body, Right, View, H2, ListItem, Text } from 'native-base';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

function Manually() {
	return (
		<View style={style.IconFrame}><Ionicons name={"cannabis"} size={22} style={style.IconCenter} /></View>
	)
}

export default class DynamicListExample extends Component {
	static navigationOptions = {
		title: '排行榜',
	};
	constructor(props) {
		super(props);
		this.state = {malelist: [], femalelist: []}
		this.getRankList()
	}
	getRankList = async () => {
		let list = await fetch("https://api.zhuishushenqi.com/ranking/gender")
		let listJson = await list.json()
		this.setState({ malelist: listJson.male, femalelist: listJson.female })
	}
	render() {
		return (
			<Container style={{backgroundColor: "#fff"}}>
				<Content>
					<View style={style.blockHeader}>
						<Ionicons name={"human-male"} size={28} style={{ color: "#007fff"}} />
						<H2>男生频道</H2>
					</View>
					<List dataArray={this.state.malelist}
						renderRow={(item) =>
							<ListItem icon onPress={() => { this.props.navigation.navigate('RankDetails', item) }}>
								<Left>
									{item.collapse ? 
										<Manually />
										:<Image source={{ uri: "https://statics.zhuishushenqi.com" + item.cover }} style={{ width: 28, height: 28 }}/>
									}
								</Left>
								<Body><Text>{item.title}</Text></Body>
							</ListItem>
						}>
					</List>
					<View style={[style.blockHeader, {marginTop: 20}]}>
						<Ionicons name={"human-female"} size={28} style={{ color: "#ea6f5a" }} />
						<H2>女生频道</H2>
					</View>
					<List dataArray={this.state.femalelist}
						renderRow={(item) =>
							<ListItem icon onPress={() => { this.props.navigation.navigate('RankDetails', item) }}>
								<Left>
									{item.collapse ? 
										<Manually />
										:<Image source={{ uri: "https://statics.zhuishushenqi.com" + item.cover }} style={{ width: 28, height: 28 }}/>
									}
								</Left>
								<Body><Text>{item.title}</Text></Body>
							</ListItem>
						}>
					</List>
				</Content>
			</Container>
		);
	}
}

const style = StyleSheet.create({
	blockHeader: {
		flexDirection: 'row',
		padding: 12,
		paddingLeft: 6
	},
	IconFrame: {
		width: 28,
		height: 28,
		backgroundColor: "#ea5a5a",
		borderRadius: 28,
	},
	IconCenter: {
		color: "#fff",
		lineHeight: 28,
		textAlign: "center",
		backgroundColor: "transparent"
	}
})