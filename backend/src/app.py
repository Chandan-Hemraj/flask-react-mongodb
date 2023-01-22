from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from config import config


app = Flask(__name__)
app.config["MONGO_URI"] = config["MONGO_URI"]

CORS(app)
mongo = PyMongo(app)

db = mongo.db.users

@app.route("/users", methods=["GET","PUT"])
def get_users():
    
    users = []
    
    ## Get all users
    if request.method == "GET":
        data = db.find()
    
    ## Get users by query
    elif request.method == "PUT":
        data = db.find(request.json)
        
    for user in data:
        users.append({
            "_id": str(user["_id"]),
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "phone": user["phone"],
            "message": user["message"],
        })
    return jsonify(users)

@app.route("/user/<id>", methods=["GET", "PUT", "DELETE"])
def get_user(id):
    
    ## Get user by id
    if request.method == "GET":
        user = db.find_one({"_id": ObjectId(id)})
        if user is not None:
            user["_id"] = str(user["_id"])
        else:
            user = {}
        return jsonify(user=user)
    
    ## Update user
    if request.method == "PUT":
        db.update_one({'_id': ObjectId(id)}, {
            "$set" : {
                "first_name": request.json["first_name"],
                "last_name": request.json["last_name"],
                "email": request.json["email"],
                "phone": request.json["phone"],
                "message": request.json["message"],
            }
        })
        return jsonify(message="user updated", id=id)
    
    ## Delete user
    if request.method == "DELETE":
        db.delete_one({'_id': ObjectId(id)})
        return jsonify(message="user deleted", id=id)

## Create user
@app.route("/user", methods=["POST"])
def create_user():
    user = db.insert_one({
        "first_name": request.json["first_name"],
        "last_name": request.json["last_name"],
        "email": request.json["email"],
        "phone": request.json["phone"],
        "message": request.json["message"],
    })
    return jsonify(id=str(user.inserted_id), message="user created sucessfully.")

## send email
@app.route("/sendemail", methods=["GET"])
def send_email():
    return jsonify(message="email sent")

if __name__ == "__main__":
    app.run(debug=True)