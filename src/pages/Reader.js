import React, { Component } from 'react';
import { View, Text,  } from 'react-native';
import axios from 'axios'
import Test from './text';

class Reader extends Component {
	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state
		this.state={

		}
		//Storage.clearMapForKey('bookList');
		//this.getList(params._id)
	}
	componentDidMount() {
		//this.getRankList()
	}

	getList = async () => {
		let list = await fetch("https://api.zhuishushenqi.com/atoc/574449db9eeb98130f1320a2?view=chapters")
		let listJson = await list.json()
		console.log(listJson);
	}
	getList1 = (bookId) => {
		Storage.load({
			key: "bookList",
			id: bookId,
			syncParams: {
				extraFetchOptions: {
					bookId
				},
				someFlag: true
			}
		}).then(res => {
			console.log(res);
		})
	}
	render() {
		return (
			<View style={{flex:1}}>
				<Test />
			</View>
		);
	}
}

export default Reader;
