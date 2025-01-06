from flask import Flask, Blueprint

# Create the Flask application instance
app = Flask(__name__)

# Create a blueprint for the main routes
main_blueprint = Blueprint('main', __name__)

@app.route('/')
def index():
    return 'Hello from the Flask app!'

# Register the blueprint with the app
app.register_blueprint(main_blueprint)