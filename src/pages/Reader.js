import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import axios from 'axios'
import Test from './text';
import ReadContent from '../components/readContent'
import RNFS from 'react-native-fs';
var publicFilePath = RNFS.DocumentDirectoryPath;

class Reader extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state
		this.state={
			params,
			initContent: "",
			isHasMenu: true,
			config: [],
			menuList: {},
			mark: {index: 0, markContent: ""}
		}
	}
	saveMenu = (data) => {
		console.log(data);
		Storage.save({
			key: "bookList",
			id: this.state.params._id,
			data,
			expires: null
		})
		.then(res => {
			this.getMenu()
		})
	}
	getMark = () => {
		Storage.load({
			key: "marks",
			id: this.state.params._id
		})
		.then(res => {
			this.setState({
				mark: res
			})
			this.getMenu()
		})
		.catch(err => {
			Storage.save({
				key: "marks",
				id: this.state.params._id,
				data: {index: 0, markContent: ""},
				expires: null
			})
			.then(res => {
				this.getMenu()
			})
		})
	}
	getMenu = () => {
		Storage.load({
			key: "bookList",
			id: this.state.params._id
		})
		.then(res => {
			this.setState({
				menuList: res,
			})
			this.gotoRead()
		})
		.catch(err => {
			if (err.name == "NotFoundError") {
				this.setState({isHasMenu: false})
			}
		})
	}
	getContent = async (index) => {
		let path = await this.getContentSave(this.state.params._id, index)
		return path
	}
	gotoRead = async () => {
		let { config } = await Storage.load({key: 'readConfig'})
		//let initContent = await this.getContentSave(this.state.params._id, this.state.mark.index)
		//console.log(initContent);
		this.setState({ config })
		//this.setState({ initContent })
	}
	getContentSave = async (id, index) => {
		if(this.state.menuList.chapters[index].content) {
			try {
				let content = await await RNFS.readFile(this.state.menuList.chapters[index].content)
				return content
			} catch (error) {
				let menuCache = {...this.state.menuList}
				menuCache.chapters[index].content = null
				this.setState({ menuList: menuCache})
				this.getContentSave(id, index)
			}
		}
		// if (this.state.menuList.chapters[index].content) {
		// 	return this.state.menuList.chapters[index].content
		// }
		let url = this.state.menuList.chapters[index].link
		let list = await fetch("https://chapterup.zhuishushenqi.com/chapter/" + url)
		let listJson = await list.json()
		try {
			await RNFS.writeFile(publicFilePath + `/superReader/${id}/${index}.txt`, listJson.chapter.cpContent, 'utf8')
		} catch (error) {
			await RNFS.mkdir(publicFilePath + `/superReader/${id}/test.txt`, { NSURLIsExcludedFromBackupKey: true})
			await RNFS.writeFile(publicFilePath + `/superReader/${id}/${index}.txt`, listJson.chapter.cpContent, 'utf8')
		}
		let path = publicFilePath + `/superReader/${id}/${index}.txt`
		let menuCache = this.state.menuList
		menuCache.chapters[index].content = path
		this.setState({ menuList: menuCache})
		Storage.save({
			key: "bookList",
			id: this.state.params._id,
			data: menuCache,
			expires: null
		})
		return listJson.chapter.cpContent
	}
	mkdirNewFile = async (path) => {
		const options = {
			NSURLIsExcludedFromBackupKey: true, // iOS only
		};
		RNFS.mkdir(path, options)
	}
	componentDidMount() {
		//Storage.clearMapForKey('bookList');
		//Storage.clearMapForKey('marks');
		this.getMark()
		//this.getMenu()
	}

	render() {
		return (
			<View style={{flex:1}}>
				<StatusBar hidden={true}/>
				{this.state.isHasMenu ? null : <Test bookid={this.state.params._id} save={this.saveMenu} />}
				{this.state.menuList.chapters &&  this.state.config.length > 0? 
					<ReadContent
						initContent={{ mark: this.state.mark}}
						mark={this.state.mark}
						config={this.state.config}
						getContent={this.getContent} /> : null}
			</View>
		);
	}
}

export default Reader;
