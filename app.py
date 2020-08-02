from flask import Flask,request, redirect, url_for, render_template, make_response, session, flash, send_from_directory
from flask_mysqldb import MySQL
from functions import validateImg
import uuid
import os

#-------------------------Variables--------------------
img_direction = os.path.abspath("imagenes/")

#-------------------------CONFIG-----------------------
app = Flask(__name__)
app.config["IMG_DIRECTION"] = img_direction
app.config["MYSQL_HOST"] = "Localhost"
app.config["MYSQL_DB"] = "blog"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "2001yael"
app.config["SECRET_KEY"] = "claveSecreta"
sql = MySQL(app)

#--------------------------Funciones-----------------------
def get_user(id):
    cursor = sql.connection.cursor()
    cursor.execute("select nombre, apellidos, descricion, img from user where id like %s;",[id])
    user =  cursor.fetchone()
    return user
#--------------------------Routes--------------------------
@app.route("/")
@app.route("/home")
def home():
    if "userID" in session:    
        dates = None
        cursor = sql.connection.cursor()
        cursor.execute("select * from post  order by  post_id DESC limit 10; ")
        post =  cursor.fetchmany(size=10)
        user = session["userID"]
        usuario = get_user(user)
        return render_template("home.html", dates = post, get_user = get_user, user = usuario)
    else:
        return redirect(url_for("login"))

@app.route("/registrar", methods = ["POST", "GET"])
def registrar():
    if "userID"  not in session:
        if request.method == "GET":
            return render_template("registrar.html")
        elif request.method == "POST":
            name =  request.form["nombre"]
            email =  request.form["email"]
            apellidos =  request.form["apellidos"]
            pas =  request.form["password"]
            des =  request.form["descripcion"]
            try:
                cursor = sql.connection.cursor()
                cursor.execute("insert into user(nombre, apellidos, email, password, descricion) values (%s, %s, %s, %s, %s);",(name,apellidos,email,pas,des))
                sql.connection.commit()
            except Exception as e:
                return str(e)
            cursor.execute("select id from user where email like %s and password like %s ",(email, pas))
            id = str(cursor.fetchone()[0])    
            session["userID"] = id
            return redirect(url_for("home"))
    else:
        return redirect(url_for("home"))

@app.route("/postear", methods = ["GET"] )
def make_post():
    if "userID" in session:
        if request.method=="GET":
            id = session["userID"]
            return render_template("post.html", user  =  get_user(id))
    else:
        return redirect(url_for("home"))
@app.route("/postear", methods = ["POST"] )
def postear():
    if "userID" in session:
        if request.method=="POST":
            id = session["userID"]
            image = request.files["imagen"]
            titulo = request.form["titulo"]
            descripcion = request.form["descripcion"]
            cursor = sql.connection.cursor()
            if image:
                imgname = image.filename
                imgname = str(uuid.uuid4()) +"."+imgname.rsplit(".",1)[1]
                if imgname != "" and validateImg(imgname):
                    image.save(os.path.join(app.config["IMG_DIRECTION"], imgname))
                    cursor.execute("insert into post (usuario, titulo, descripcion, img) values (%s, %s, %s, %s);",(id, titulo, descripcion, imgname))
            else:
                cursor.execute("insert into post (usuario, titulo, descripcion) values (%s, %s, %s);",(id, titulo, descripcion))
            sql.connection.commit()
            return redirect(url_for("home"))
    else:
        return redirect(url_for("login"))

@app.route("/login", methods = ["GET", "POST"])
def login():
    if "userID"  not in session:
        if request.method == "GET":
            return render_template("login.html")
        
        if request.method == "POST":
            email = request.form["email"]
            password = request.form["password"]
            if email == "" or password == "":
                flash("Debe llenar todos los campos","warning")
                return "todos los campos deben estar completos"
            else:
                cursor = sql.connection.cursor()
                cursor.execute("select * from user where email like %s;",[email])
                users  =  cursor.fetchall()
                if users:
                    for user in users:
                        if password in user:
                            session["userID"] = user[0]
                            return redirect(url_for("home"))
                        else:
                            flash("incorrect password","error")
                            return "incorrect password"
                else:
                    flash("incorrect email","error")
                    return "incorrect email"
    else:
        return redirect(url_for("home"))

@app.route("/public/image/<name>")
def public(name):
    return send_from_directory(app.config["IMG_DIRECTION"],name)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

@app.route("/ajuste", methods = ["GET","POST"])
def ajustes():
    if "userID" in session:
        if request.method == "GET":
            user = session["userID"]
            cursor = sql.connection.cursor()
            cursor.execute("select nombre, apellidos, descricion, email, password, img from user where id like %s;",[user])
            user =  cursor.fetchone()
            return render_template("ajuste.html", user = user)
        elif request.method == "POST":
            user = session["userID"]
            img = request.files["picture"]
            name =  request.form["nombre"]
            email =  request.form["email"]
            apellidos =  request.form["apellidos"]
            pas =  request.form["password"]
            des =  request.form["descripcion"]
#-------------------------------------------------------------------------------------
            cursor = sql.connection.cursor()

            if img:
                imageName = img.filename
                imageName = str(uuid.uuid4()) +"."+imageName.rsplit(".",1)[1]
                if imageName != "" and validateImg(imageName):
                    cursor.execute(" select img from user where id like %s",[user])
                    ifImage = cursor.fetchone()[0]
                    if  ifImage != "":
                        try:
                            os.remove(app.config["IMG_DIRECTION"]+"/"+ifImage)
                        except:
                            pass
                    img.save(os.path.join(app.config["IMG_DIRECTION"],imageName))
                    cursor.execute("update user set nombre = %s, apellidos = %s, email = %s, password = %s, descricion = %s, img = %s where id like %s;",(name,apellidos,email,pas,des,imageName, user))
                else:
                    cursor.execute("update user set nombre = %s, apellidos = %s, email = %s, password = %s, descricion = %s where id like %s;",(name,apellidos,email,pas,des,user))
                    flash("Formato de imagen invalido")
            sql.connection.commit()
            return redirect(url_for("ajustes"))
    else:
        return redirect(url_for("login"))
#--------------------------server setting--------------
if __name__ == "__main__":
    app.run(
        debug=True
    )