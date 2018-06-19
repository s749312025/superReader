import React from 'react';
import { View, FlatList, Button, Alert, StyleSheet, Image, DeviceEventEmitter } from 'react-native';
import { Container, Content, List, ListItem, Left, Right, Text, Body } from 'native-base';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/zh-cn'

moment.locale('zh-cn');

import Swipeout from 'react-native-swipeout';

class BookShelf extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAllowScroll: true,
			refreshing: false,
			books: []
		}
		this.openNum = 0
		this.deleteBook = this.deleteBook.bind(this)
		this.getBooks()
	}
	componentDidMount() {
		DeviceEventEmitter.addListener('BookShelfRefresh', this.getBooks);  
	}
	componentWillUnmount() {
		DeviceEventEmitter.remove();
	}
	getBooks = () => {
		Storage.getAllDataForKey('books').then(books => {
			console.log(books)
			this.setState({books})
		});
	}
	deleteBook = (item) => {
		var confirm = (id) => {
			this.setState({ isAllowScroll: true })
			Storage.remove({
				key: 'books',
				id,
			})
			Storage.remove({
				key: 'bookList',
				id,
			})
			this.getBooks()
		}
		Alert.alert('删除', `是否删除书本 《${item.title}》`,
			[
				{ text: "取消", onPress: () => {} },
				{ text: "确定", onPress: () => { confirm(item._id)} },
			]
		);
		
	}
	updateRemote = async () => {
		let ids = await Storage.getIdsForKey('books');
		let allIds = ids.join();
		let list = await fetch("https://api.zhuishushenqi.com/book?view=updated&id=" + allIds);
		let listJson = await list.json()
		for (let i = 0; i < listJson.length; i++) {
			let oldData = this.state.books.find((n) => n._id == listJson[i]._id)
			oldData.updated = listJson[i].updated
			oldData.chaptersCount = listJson[i].chaptersCount
			oldData.lastChapter = listJson[i].lastChapter
			console.log(oldData)
			await Storage.save({
				key: "books",
				id: listJson[i]._id,
				data: oldData,
				expires: null
			})
		}
		this.getBooks()
	}
	ListFooterComponent = () => {
		return <ListItem style={{height: 50}}>
			<Icon name='search' onPress={() => { this.props.navigation.navigate("Search") }} />
		</ListItem>
	}
	_onRefresh = () => {
		this.updateRemote()
	}
	isScroll = (num) => {
		this.openNum += num
		this.openNum > 0 ? this.setState({ isAllowScroll: false }) : this.setState({ isAllowScroll: true })
		console.log(this.openNum,num);
	}
	render() {
		var a = function (params) {
			this._test()
		}
		return (
			<View style={{ backgroundColor: "#fff", flex: 1,}}>
				<FlatList data={this.state.books}
					keyExtractor={(item, index) => item._id + index}
					onRefresh={this._onRefresh}
					refreshing={false}
					scrollEnabled={this.state.isAllowScroll}
					ListFooterComponent={this._createListFooter}
					renderItem={({ item }) =>
						<Swipeout
						//close={true}
						onOpen={() => { this.setState({ isAllowScroll: false }) }}
						onClose={() => { this.setState({ isAllowScroll: true }) }}
						backgroundColor={"#fff"} 
							right={[{
								text: "删除",
								type: "delete",
								onPress: () => { this.deleteBook(item)}
								}] }>
						<ListItem onPress={() => { this.props.navigation.navigate('Reader', item) }}>
							<Image style={{ width: 52, height: 74 }} source={{ uri: 'https://statics.zhuishushenqi.com' + item.cover }} />
							<Body>
								<Text>{item.title}</Text>
								<Text note style={[styles.mt10, styles.note]}>{item.author} | {item.majorCate ? item.majorCate : item.cat}</Text>
								<Text note style={[styles.note, styles.mt10]}>最新章节：{item.lastChapter}</Text>
								<Text note style={[styles.note, styles.mt5]}>最后更新：{moment(item.updated).fromNow()}</Text>
							</Body>
						</ListItem>
						</Swipeout>
					}>
				</FlatList>
			</View>
		);
	}
}

export default withNavigation(BookShelf);

const styles = StyleSheet.create({
	mt10: {
		marginTop: 5,
	},
	note: {
		fontSize: 12,
		fontWeight: 'normal',
	},
	intro: {
		maxHeight: 25,
		overflow: 'hidden',
	},
	tip: {
		fontSize: 14,
		color: "#666",
		fontWeight: 'normal',
	}
})