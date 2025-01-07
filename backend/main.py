from flask import Flask, Blueprint, request, jsonify
from secrets import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
import flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import uuid


app = Flask(__name__)
CORS(app)



app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False




db = SQLAlchemy(app)





main_blueprint = Blueprint('main', __name__)

@app.route('/api/poll' , methods=['GET', 'POST'])
def poll():
    if request.method == 'GET':
        body = request.args
    else:
        body = request.get_json()
    
    if request.method == 'GET':
        if not body.get("id"):
            return jsonify({"error": "No poll ID provided"}), 400
        poll_id = body["id"]
        
        
        return jsonify({
            "question": "What is your favorite color?",
            "options": ["Red", "Blue", "Green", "Yellow"],
            "end": ""
        }), 200
    elif request.method == 'POST':
        return
    return 

@app.route('/api/poll/<poll_id>/vote', methods=['POST'])
def vote(poll_id):
    body = request.get_json()
    # Add vote handling
    
    return jsonify({"message": "Vote received"}), 200


app.register_blueprint(main_blueprint)

