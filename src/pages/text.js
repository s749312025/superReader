import React, { Component } from 'react';
import { View, WebView } from 'react-native';

class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sourceId: ""
		}
	}
	_onMessage = async (e) => {
		//console.log(e.nativeEvent.data);
		this.props.save(JSON.parse(e.nativeEvent.data))
	}
	
	componentWillMount() {
		this.getSourceId()
		
	}
	getSourceId = async () => {
		let isCanget = true
		//http://api.zhuishushenqi.com/btoc/5624fc7549d2a9a66871df4e?view=chapters&channel=mweb
		let list = await fetch("https://api.zhuishushenqi.com/btoc?view=summary&book=" + this.props.bookid)
		let listJson = await list.json()
		if (listJson.length == 0) {
			isCanget = false;
			let list = await fetch("https://api.zhuishushenqi.com/ctoc?view=summary&book=" + this.props.bookid)
			let listJson = await list.json()
			this.setState({ sourceId: listJson[0]._id })
		}else {
			this.setState({ sourceId: listJson[0]._id })
		}
	}
	
	render() {
		const data = `document.addEventListener('message', function (e) {
									var request = new XMLHttpRequest();
									request.onreadystatechange = (e) => {
										if (request.readyState !== 4) {
											return;
										}
										if (request.status === 200) {
											window.postMessage(request.responseText);
										} else {
											window.postMessage(request.responseText);
										}
									};
									request.open('GET', 'https://api.zhuishushenqi.com/atoc/${this.state.sourceId}?view=chapters');
									request.send();
								});`
		return (
			<View>
				{this.state.sourceId == "" ? null : 
					<WebView
						ref={'webview'}
						source={{ uri: "https://api.zhuishushenqi.com/ranking/gender" }}
						injectedJavaScript={data}
						onLoadEnd={() => { this.refs.webview.postMessage(); }}
						onMessage={this._onMessage}
					/>}
			</View>
		);
	}
}

export default Test;
