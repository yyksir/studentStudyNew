import Vue from 'vue'

import {
	message,
	Tooltip,
	Button,
	Icon,
	Menu,
// 	SubMenu,
// 	MenuItem,
// 	Item,
	LocaleProvider,
	Table,
	Pagination,
	Popconfirm,
	Form,
	Input,
	Select,
	DatePicker,
	Tag,
	Spin,
	Modal,
	Radio,
	// radioGroup,
	Switch,
} from 'ant-design-vue'

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm

Vue.use(message)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Menu)
// Vue.use(SubMenu)
// Vue.use(MenuItem)
// Vue.use(Item)
Vue.use(LocaleProvider)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Popconfirm)
Vue.use(Form)
Vue.use(Input)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(Tag)
Vue.use(Spin)
Vue.use(Modal)
Vue.use(Radio)
// Vue.use(radioGroup)
Vue.use(Switch)