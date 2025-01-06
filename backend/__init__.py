from flask import Flask

def create_app():
    app = Flask(__name__)

    # Example configuration
    app.config.from_mapping(
        SECRET_KEY="your-secret-key",
        DATABASE="path/to/database"
    )

    # Import and register blueprints or routes
    from .main import main_blueprint
    app.register_blueprint(main_blueprint)

    return app

# For Gunicorn to locate the application
app = create_app()
