import React, { Component } from 'react';
import { View, StatusBar, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Container, Content, Header, Item, List, ListItem, Left, Body, Right, Input, Icon, Button, Text } from 'native-base';
import Evicon from 'react-native-vector-icons/EvilIcons';

class Search extends Component {
	static navigationOptions = {
		title: '搜索',
	};
	constructor(props) {
		super(props);
		this.state={
			focus: false,
			keyword: "",
			historyList: [],
			keywordList: [],
			hotword: []
		}
	}
	renderRow = (item) => {
		return (
			<View>
				<Text>item</Text>
			</View>
		)
	}
	renderEmptyResult = () => {
		return <View><Text>无数据</Text></View>
	}
	_onChangeText = (keyword) => {
		this.setState({ keyword })
		this.getAutoList()
	}
	_clearText = () => {
		this.setState({ keyword: "" })
	}
	getHotList = async () => {
		let list = await fetch("https://api.zhuishushenqi.com/book/search-hotwords")
		let listJson = await list.json()
		this.setState({ hotword: listJson.searchHotWords })
	}
	getAutoList = async () => {
		let list = await fetch("https://api.zhuishushenqi.com/book/auto-complete?query=" + this.state.keyword)
		let listJson = await list.json()
		this.setState({ keywordList: listJson.keywords })
		console.log(this.state);
	}
	refreshHot = () => {
		let all = this.state.hotword
		let old = all.splice(0,20)
		console.log(all.concat(old));
		this.setState({ hotword: all.concat(old)})
	}
	delHistory = () => {
		Storage.clearMapForKey('searchHistory').then(() => {
			this.getSearchHistory()
		})
	}
	search = (name) => {
		Storage.save({
			key: "searchHistory",
			id: new Date().getTime(),
			data: {
				name: name
			},
			expires: null
		}).then(() => {
			console.log("save success")
			this.getSearchHistory()
		})
		//this.goto(this.state.keyword)
	}
	getSearchHistory = () => {
		Storage.getAllDataForKey('searchHistory').then(list => {
			console.log(list)
			this.setState({ historyList: list })
		}).catch(err=> {
			this.setState({ historyList: []})
		})
	}
	goto = (name) => {
		this.search(name)
		let searchParams = {
			isLoading: true,
			url: "https://api.zhuishushenqi.com/book/fuzzy-search?query=" + name
		}
		this.props.navigation.navigate('Books', { title: "搜索", ...searchParams })
	}

	_onFocus = () => {
		this.setState({focus: true})
	}
	cancel = () => {
		this.refs.searchInput.blur()
	}
	_onBlur = () => {
		this.setState({focus: false})
		//this.refs.searchInput.blur()
	}
	componentDidMount = () => {
		this.getHotList()
		this.getSearchHistory()
	}
	
	render() {
		return (
			<Container style={{backgroundColor: "#fff"}}>
				<Header searchBar rounded style={{paddingTop: 0,}}>
					<Item>
						<Icon name="ios-search" />
						<TextInput 
							ref="searchInput"
							value={this.state.keyword}
							onChangeText={this._onChangeText}
							onFocus={this._onFocus}
							onBlur={this._onBlur}
							returnKeyType='search'
							onSubmitEditing={() => { this.goto(this.state.keyword)}}
							placeholder="请输入书名" 
							style={{fontSize: 14, paddingLeft: 0, flex: 1}}/>
            <Icon name="md-close-circle" style={{color:"#999"}} onPress={() => {this._clearText()}}/>
					</Item>
					{
						this.state.focus ? 
							<Text onPress={this.cancel} style={{ lineHeight: 60, marginLeft: 15, color: "#26a5ff" }}>取消</Text>
							: null
					}
				</Header>
				<StatusBar barStyle="light-content" />
				<Content style={{display: this.state.focus ? "none" : "flex",}} padder>
					<View style={styles.titleTool}>
						<Text style={{fontSize: 18,}}>大家都在搜</Text>
						<View style={{flexDirection: 'row'}}>
							<Icon name="ios-refresh" style={{fontSize: 22, lineHeight: 19, color: "#999"}} />
							<Text note style={{ marginLeft: 3, fontWeight: 'normal', }} onPress={() => { this.refreshHot() }}>换一批</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap',paddingLeft: 20, paddingRight: 20,}}>
						{
							this.state.hotword.slice(0,19).map((item,index) => {
								return <View style={[styles.hotTip, { backgroundColor: colors[index % 15] }]} key={item.word}><Text style={{ color: "#fff" }} onPress={() => { this.goto(item.word) }}>{item.word}</Text></View>
							})
						}
					</View>
					<View style={styles.titleTool}>
						<Text style={{ fontSize: 18, }}>搜索历史</Text>
						<View style={{ flexDirection: 'row' }}>
							<Icon name="trash" style={{ fontSize: 22, lineHeight: 19, color: "#777" }} />
							<Text note style={{ marginLeft: 3, fontWeight: 'normal', }} onPress={() => { this.delHistory() }}>清空</Text>
						</View>
					</View>
					<View>
						{
							this.state.historyList.map((item, index) => {
								return (<ListItem icon key={index} style={{ paddingLeft: 0, }} onPress={() => {this.goto(item.name)}}>
									<Left>
										<Evicon name="clock" size={26} style={{color: "#777"}}/>
									</Left>
									<Body>
										<Text style={{ color: "#666" }}>{item.name}</Text>
									</Body>
								</ListItem>)
								//return <View key={index}><Text>{item.name}</Text></View>
							})
						}
					</View>
				</Content>
				<Content style={{ display: this.state.focus ? "flex" : "none", }}>
					<ScrollView
						style={{flex: 1,}}
						keyboardShouldPersistTaps="handled"
						>
						{
							this.state.keywordList.map((item) => {
								return (
									<ListItem key={item} onPress={() => { this.goto(item) }}>
										<Text>{item}</Text>
									</ListItem>
								)
							})
						}
					</ScrollView>
				</Content>
			</Container>
		);
	}
}

export default Search

const colors = [
	'#6b52ae', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
	'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
	'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
]

const styles = StyleSheet.create({
	titleTool: {
		paddingLeft: 18,
		paddingRight: 18,
		marginTop: 20,
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: "space-between"
	},
	hotTip: {
		padding: 8,
		paddingTop: 3,
		paddingBottom: 3,
		borderRadius: 5,
		marginTop: 3,
		marginRight: 10,
		marginBottom: 8,
	}
});