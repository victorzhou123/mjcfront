import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import { baseComponent } from "@/utils/base.js";
import { user } from "@/utils/user.js";

export function createApp() {
	const app = createSSRApp(App);
	
	// 将BaseComponent实例挂载到全局属性上
	app.config.globalProperties.$baseComponent = baseComponent;
	// 将User实例挂载到全局属性上
	app.config.globalProperties.$user = user;
	
	return {
		app,
	};
}
