import psycopg2

# Connection parameters
params = {
    'dbname': 'postgres',
    'user': 'postgres.ysezicwpvxpyoinljhaf',
    'password': 'Dante@2025',
    'host': 'aws-0-us-east-2.pooler.supabase.com',
    'port': '5432',
    'sslmode': 'require'
}

try:
    # Connect to the database
    print("Connecting to the database...")
    conn = psycopg2.connect(**params)
    
    # Create a cursor
    cur = conn.cursor()
    
    # Execute a test query
    print("Executing test query...")
    cur.execute('SELECT version();')
    
    # Fetch the result
    version = cur.fetchone()
    print(f"PostgreSQL version: {version[0]}")
    
    # Close cursor and connection
    cur.close()
    conn.close()
    print("Connection test successful!")
    
except Exception as e:
    print(f"Error: {e}") 