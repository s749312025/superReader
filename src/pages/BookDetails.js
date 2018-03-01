import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions, DeviceEventEmitter } from 'react-native';
import { Container, Content, List, ListItem, Text, Button, Left, Body, Right } from 'native-base';
import moment from 'moment';
import 'moment/locale/zh-cn'

moment.locale('zh-cn');
var ScreenWidth = Dimensions.get('window').width

class BookDetails extends Component {
	static navigationOptions = {
		title: '书籍详情'
	}
	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state;
		this.state={
			bookDetails: {},
			isJoin: false,
		}
		this.getRankList(params._id)
	}
	getRankList = async (id) => {
		let list = await fetch("https://api.zhuishushenqi.com/book/" + id)
		let listJson = await list.json()
		await this.setState({ bookDetails: listJson })
		this.loadStorage()
		console.log(this.state)
	}
	loadStorage = async () => {
		Storage.getIdsForKey('books').then(ids => {
			console.log(ids)
			ids.includes(this.state.bookDetails._id) ? this.setState({ isJoin: true }) : null
		});
	}
	join = () => {
		if (this.state.isJoin) return
		Storage.save({
			key: "books",
			id: this.state.bookDetails._id,
			data: this.state.bookDetails,
			expires: null
		}).then(res => {
			this.loadStorage()
			DeviceEventEmitter.emit('BookShelfRefresh',{});
		})
	}
	render() {
		return (
			<Container style={{backgroundColor: '#fff'}}>
				<Content>
					<List>
						<ListItem style={{borderBottomWidth: 0,}}>
								<Image style={{ width: 78, height: 110 }} source={{ uri: 'https://statics.zhuishushenqi.com' + this.state.bookDetails.cover }} />
							<Body>
								<Text>{this.state.bookDetails.title}</Text>
								<Text note style={[styles.note, styles.mt5]}>{this.state.bookDetails.author} | {this.state.bookDetails.minorCate} | {(this.state.bookDetails.wordCount / 10000).toFixed(2)}万字</Text>
								<Text note style={[styles.note, styles.mt5]}>更新：{moment(this.state.bookDetails.updated).fromNow()}</Text>
								<Text note style={[styles.note, styles.mt5]}>最新章节：{this.state.bookDetails.lastChapter}</Text>
							</Body>
						</ListItem>
					</List>
					<View style={styles.btnBlock}>
						<Button disabled={this.state.isJoin ? true : false} bordered style={styles.btnBlockButton} onPress={() => {this.join()}}>
							<Text> {this.state.isJoin ? "已在书架" : "加入书架"} </Text>
						</Button>
						<Button primary style={[styles.btnBlockButton, {marginLeft: 20,}]}>
							<Text> 开始阅读 </Text>
						</Button>
					</View>
					<View style={styles.chartBlock}>
						<View style={styles.bookRate}>
							<Text note style={{marginBottom: 5,}}>追人气</Text>
							<Text style={{ fontSize: 18, color: "#666" }}>{(this.state.bookDetails.latelyFollower/5000).toFixed(2)}万</Text>
						</View>
						<View style={styles.bookRate}>
							<Text note style={{ marginBottom: 5, }}>读者留存率</Text>
							<Text style={{ fontSize: 18, color: "#666" }}>{this.state.bookDetails.retentionRatio}%</Text>
						</View>
						<View style={styles.bookRate}>
							<Text note style={{ marginBottom: 5, }}>日更字数/天</Text>
							<Text style={{ fontSize: 18, color: "#666" }}>{this.state.bookDetails.serializeWordCount}</Text>
						</View>
					</View>
					<View style={styles.intro}>
						<Text style={{color: "#444",lineHeight: 18}}>{this.state.bookDetails.longIntro}</Text>
					</View>
				</Content>
			</Container>
		);
	}
}

export default BookDetails;

const styles = StyleSheet.create({
	mt5: {
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
	},
	btnBlock: {
		padding: 20,
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderColor: "#ddd",
	},
	btnBlockButton: {
		width: (ScreenWidth - 60) / 2,
		flexDirection: 'column',
		justifyContent: "center"
	},
	chartBlock: {
		flexDirection: 'row',
		height: 80,
		borderBottomWidth: 0.5,
		borderColor: "#ddd",
	},
	bookRate: {
		width: ScreenWidth/3,
		justifyContent: "center",
		alignItems: "center"
	},
	intro: {
		padding: 20,
		borderBottomWidth: 0.5,
		borderColor: "#ddd",
	}
})