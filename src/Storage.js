import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';


var storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	sync: {
		bookList(params) {
			let { id, resolve, reject, syncParams: { extraFetchOptions, someFlag } } = params;
			console.log(extraFetchOptions);
			fetch("https://api.zhuishushenqi.com/btoc?view=summary&book=" + extraFetchOptions.bookId)
			.then(list => {
				return list.json()
				.then(listJson => {
					console.log(listJson);
					fetch(`https://api.zhuishushenqi.com/atoc/${listJson._id}?view=chapters`)
						.then(menuList => {
							return menuList.json()
							.then(menuListJson => {
								console.log(menuListJson);
								let data = {
									data: menuListJson,
									mark: { index: 0, markCont: "" }
								}
								console.log(data);
								storage.save({
									key: "bookList",
									id: extraFetchOptions.bookId,
									data
								})
								return data
							})
						})
				})
				
			})
			// let list = await fetch("https://api.zhuishushenqi.com/btoc?view=summary&book=" + extraFetchOptions.bookId)
			// let listJson = await list.json()
			// let sourceId = listJson._id
			// let menuList = await fetch(`https://api.zhuishushenqi.com/atoc/${sourceId}?view=chapters"`)
			// let menuListJson = await menuList.json()
			// let data = {
			// 	data: menuListJson,
			// 	mark: { index: 0, markCont: "" }
			// }
			// console.log(data);
			// storage.save({
			// 	key: "bookList",
			// 	id: extraFetchOptions.bookId,
			// 	data
			// })
			// return data
		}
	}
})

global.Storage = storage