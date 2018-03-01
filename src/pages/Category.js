import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Text, Content, Body } from 'native-base';

var ScreenWidth = Dimensions.get('window').width

class Category extends Component {
	static navigationOptions = {
		title: '分类'
	}
	constructor(props) {
		super(props);
		this.state = { list: { male: [], female: []}}
		this.getCateList()
	}
	getCateList = async (id) => {
		let list = await fetch("https://api.zhuishushenqi.com/cats/lv2/statistics")
		let listJson = await list.json()
		this.setState({ list: listJson })
	}
	goto = (item) => {
		let params = {
			isLoading: true,
			url: `https://api.zhuishushenqi.com/book/by-categories?gender=male&type=hot&major=${item.name}&minor=`
		}
		this.props.navigation.navigate('Books', {title: item.name, ...params})
	}
	render() {
		return (
			<Container style={{backgroundColor: "#fff"}}>
				<Content>
					<View style={[styles.cateBorder]}><Text note style={styles.bigCate}>男生</Text></View>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap',}}>
						{this.state.list.male.map((item) => 
							<TouchableOpacity key={item.name} style={[styles.cateBorder, styles.smallCate]}
								onPress={() => {this.goto(item)}}
							>
								<Text>{item.name}</Text><Text note style={styles.mt5}>{item.bookCount}本</Text>
							</TouchableOpacity>
						)}
					</View>
					<View style={[styles.cateBorder, {marginTop: 10,}]}><Text note style={styles.bigCate}>女生</Text></View>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
						{this.state.list.female.map((item) =>
							<TouchableOpacity key={item.name} style={[styles.cateBorder, styles.smallCate]}
								onPress={() => { this.goto(item) }}
							>
								<Text>{item.name}</Text><Text note style={styles.mt5}>{item.bookCount}本</Text>
							</TouchableOpacity>
						)}
					</View>
				</Content>
			</Container>
			
		);
	}
}

export default Category;

const styles = StyleSheet.create({
	mt5: {
		marginTop: 5,
	},
	cateBorder: {
		borderColor: "#ddd",
		borderBottomWidth: 0.5,
	},
	smallCate: {
		borderRightWidth: 0.5,
		width: ScreenWidth/3,
		height: 60,
		alignItems: "center",
		justifyContent: "center"
	},
	bigCate: {
		paddingLeft: 10,
		height: 40,
		lineHeight: 40,
	}
});