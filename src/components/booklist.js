import React, { Component } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Spinner, Right, Thumbnail, Text, Body } from 'native-base';
import { withNavigation } from 'react-navigation';

class BookList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: [],
			start: 0,
			limit: 20,
			total: 0,
			isEnd: false,
			isLoading: this.props.loading ? this.props.loading.isLoading : false
		}
		//this.moreLoading()
	}
	moreLoading = async () => {
		if (!this.state.isLoading) return;
		let list = await fetch(this.props.loading.url + `&start=${this.state.start}&limit=${this.state.limit}`)
		let listJson = await list.json()
		this.state.start += 20
		console.log(this.state)
		this.setState({ source: this.state.source.concat(listJson.books), total: listJson.total, })
		this.state.start >= this.state.total ? this.setState({ isEnd: true }) : ""
	}
	_onEndReached = () => {
		if (this.state.isLoading && this.state.start > this.state.total) {
			this.setState({isEnd: true})
		}
		if (!this.state.isLoading || this.state.start > this.state.total) return;
		this.moreLoading()
	}
	_createListFooter = () => {
		return (
			this.state.isEnd ? <Text note>加载完成</Text> : <Spinner color='#ddd' />
		)
	}
	_ListEmptyComponent = () => <Text note>暂无数据</Text>
	render() {
		return (
			<Container>
				<Content style={{backgroundColor: "#fff"}}>
					<FlatList data={this.state.isLoading ? this.state.source : this.props.source}
						keyExtractor={(item, index) =>item._id + index}
						getItemLayout={(data, index) => ({ length: 114.5, offset: 114.5 * index, index })}
						ListEmptyComponent={this._ListEmptyComponent}
						ListFooterComponent={this._createListFooter}
						style={{ height: Dimensions.get("window").height - 65}}
						onEndReached={this._onEndReached}
						onEndReachedThreshold={0.1}
						renderItem = {({item}) => 
							<ListItem onPress={() => { this.props.navigation.navigate('BookDetails', item)}}>
									<Image style={{ width: 52, height: 74 }} source={{ uri: 'https://statics.zhuishushenqi.com' + item.cover}} />
								<Body>
									<Text>{item.title}</Text>
									<Text note style={[styles.mt10, styles.note]}>{item.author} | {item.majorCate ? item.majorCate : item.cat}</Text>
									<Text note style={[styles.mt10, styles.note, styles.intro]}>{item.shortIntro}</Text>
									<Text note style={[styles.mt10, styles.tip]}>追书人:{item.latelyFollower}    留存率:{item.retentionRatio}%</Text>
								</Body>
							</ListItem>
						}>
					</FlatList>
				</Content>
			</Container>
		);
	}
}

export default withNavigation(BookList);

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