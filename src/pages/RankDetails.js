import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Segment, Icon, Content, Button, Text } from 'native-base';

import BookList from '../components/booklist';

class RankDetails extends Component {
	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;
		return {
			title: params.shortTitle
		}
	};
	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state;
		this.state = {
			source: params,
			active: "week",
			week: [],
			month: [],
			total: [],
		}
		this.getRankList(this.state.active)
		//this.tabClick = this.tabClick.bind(this)
	}
	tabClick = (time) => {
		this.setState({ active: time })
		this.state[time].length == 0 ? this.getRankList(time) : '';
	}
	getRankList = async (time) => {
		let id = time == "week" ? this.state.source._id : this.state.source[time + 'Rank']
		let list = await fetch("https://api.zhuishushenqi.com/ranking/" + id)
		let listJson = await list.json()
		this.setState({ [time]: listJson.ranking.books })
	}
	render() { 
		return (
			<Container style={{ backgroundColor: '#fff'}}>
				<Segment>
					<Button first active={this.state.active == 'week'} onPress={() => this.tabClick('week')}>
						<Text>周榜</Text>
					</Button>
					<Button active={this.state.active == 'month'} onPress={() => this.tabClick('month')}>
						<Text>月榜</Text>
					</Button>
					<Button last active={this.state.active == 'total'} onPress={() => this.tabClick('total')}>
						<Text>总榜</Text>
					</Button>
				</Segment>
				{/* <Content>
					<BookList source={this.state[this.state.active]} />
				</Content> */}
				<Content style={{ display: this.state.active == 'week' ? 'flex' : 'none',}}>
					<BookList style={{display: 'none'}} source = {this.state.week}/>
				</Content>
				<Content style={{ display: this.state.active == 'month' ? 'flex' : 'none', }}>
					<BookList source = {this.state.month}/>
				</Content>
				<Content style={{ display: this.state.active == 'total' ? 'flex' : 'none', }}>
					<BookList source = {this.state.total}/>
				</Content>
			</Container>
		);
	}
}

export default RankDetails;
