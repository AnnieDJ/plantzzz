from sqlalchemy import text  # 添加这个导入
from Api import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():  # 使用应用上下文
        # 测试数据库连接，使用Session执行查询
        try:
            with db.engine.connect() as connection:
                result = connection.execute(text('SELECT 1')).fetchall()  # 使用 text() 包裹 SQL 语句
                print("成功连接到数据库:", result)
        except Exception as e:
            print("数据库连接失败:", str(e))

        # 创建所有数据库表
        db.create_all()

    app.run(host="localhost", port=5000, debug=True)
