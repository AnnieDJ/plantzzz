from sqlalchemy import text  
from Api import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():  
        try:
            with db.engine.connect() as connection:
                result = connection.execute(text('SELECT 1')).fetchall() 
                print("success connect to aws rds database:", result)
        except Exception as e:
            print("database connect error:", str(e))

    app.run(host="0.0.0.0", port=5000, debug=True)
