import json
import hashlib
import tornado.ioloop
import tornado.web

class PageHandler(tornado.web.RequestHandler):
	def get(self):
		if authorise(self.get_cookie("auth", None)):
			self.render("./html/viewer.html")
		else:
			self.render("./html/default.html")

class EditHandler(tornado.web.RequestHandler):
	def get(self):
		if authorise(self.get_cookie("auth", None)):
			self.render("./html/editor.html")
		else:
			self.redirect("/login")
	def post(self):
		auth = authenticate(self.get_argument("password"))
		if auth:
			self.get_argument("changes", None)
			schedule = json.load("./data/schedule.json")
			for change in changes:
				if change.lesson not in schedule[change.weekday][change.grade].keys() or schedule[change.weekday][change.grade][change.lesson] == "":
					self.set_status(400)
					self.finish()
					return
				else:
					schedule[change.weekday][change.grade][change.lesson] = change.subject
			json.dump("./data/schedule.json")
		else:
			self.set_status(401)
			self.finish()

class LoginHandler(tornado.web.RequestHandler):
	def get(self):
		if authorise(self.get_cookie("auth", None)):
			self.redirect("/edit")
		else:
			self.render("./html/login.html", message="Введите пароль, чтобы продолжить")
	def post(self):
		auth = authenticate(self.get_argument("password"))
		if auth:
			self.set_cookie("auth", auth)
			self.redirect("/edit")
		else:
			self.set_status(401)
			self.render("./html/login.html", message="Неверный пароль, попробуйте еще раз")

class LogoutHandler(tornado.web.RequestHandler):
	def get(self):
		self.clear_cookie("auth")
		self.redirect("/")

def authorise(auth):
	return passhash == auth

def authenticate(password):
	auth = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
	if authorise(auth):
		return auth
	else:
		return None

def make_app():
	return tornado.web.Application([
		(r"/", PageHandler),
		(r"/edit", EditHandler),
		(r"/login", LoginHandler),
		(r"/logout", LogoutHandler),
		(r"/data/(.*)", tornado.web.StaticFileHandler, {"path": "./data"}),
		(r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "./static"})
	])

if __name__ == "__main__":
	with open("./keys", "r") as keys:
		salt = next(keys).strip()
		passhash = hashlib.sha256((salt + next(keys).strip()).encode("utf-8")).hexdigest()
	app = make_app()
	app.listen(8888)
	tornado.ioloop.IOLoop.current().start()
