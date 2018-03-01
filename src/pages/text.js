import React, { Component } from 'react';
import { View, Text, WebView } from 'react-native';

class Test extends Component {
	constructor(props) {
		super(props);
		
	}
	_onMessage = async (e) => {
		//let data = await e.nativeEvent.data.json()
		console.log(JSON.parse(e.nativeEvent.data))
	}
	render() {
		const xx = `document.addEventListener('message', function (e) {
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
									request.open('GET', 'https://api.zhuishushenqi.com/atoc/574449db9eeb98130f1320a2?view=chapters');
		     					request.send();
								});`
		return (
			<View style={{flex: 1}}>
				<WebView
					style={{flex:1}}
					ref={'webview'}
					source={{ uri: "https://api.zhuishushenqi.com/ranking/gender"}}
					injectedJavaScript={xx}
					onLoadEnd={() => { this.refs.webview.postMessage(22);}}
					onMessage= {this._onMessage}
				/>
			</View>
		);
	}
}

export default Test;
