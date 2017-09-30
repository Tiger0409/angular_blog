var validdata = {
	username: function(message) {
		if ("" == message) return "不能为空";
		else if (message.length < 6) return "不得少于6位";
		else if (message.length > 18) return "不得多于18位";
		else if (!/^[a-z]/i.test(message)) return "必须以英文字母开头";
		else if (!/^\w*$/.test(message)) return "只能是英文字母、数字或下划线";
		else return "ok";
	},
	email: function(message) {
		if ("" == message) return "不能为空";
		else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(message)) return "邮箱格式非法";
		else return "ok";
	},
	password: function(message) {
		if ("" == message) return "不能为空";
		else if (message.length < 6 || message.length > 12) return "密码得6-12位";
		else if (!/^[a-z0-9_\-]*$/i.test(message)) return "密码得有数字，大小写字母，下划线，中划线构成";
		else {
			_password = message;
			return "ok";
		}
	},
	repassword: function(message) {
		if ("" == message) return "不能为空";
		else return _password == message ? "ok" : "两次输入密码不一致";
	},
	nikiname: function(message) {
		if ("" == message) return "不能为空";
		else return /^\w*$/.test(message) ? "ok" : "只能是英文字母、数字或下划线";
	}
};


var _password;


if (typeof module == 'object') {
	module.exports = validdata;
}