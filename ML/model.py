#ML/model.py

import mysql.connector
import json
import sys
from datetime import datetime, date
from dotenv import load_dotenv
import os

load_dotenv()

def fetch_data_from_db(pincode):
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASS'),
            database=os.getenv('DB_NAME'),
            ssl_ca='./DigiCertGlobalRootCA.crt.pem',
            ssl_disabled=False  # Ensure SSL is not disabled
        )
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT Tender_ID, pincode, Sanction_Date, Completion_Date, Priorities 
            FROM tenders 
            WHERE pincode = %s
        """
        cursor.execute(query, (pincode,))
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        # Output error as JSON
        print(json.dumps({'error': f'Database error: {err}'}))
        sys.exit(1)
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Pincode argument is missing'}))
        sys.exit(1)

    pincode = sys.argv[1]
    data = fetch_data_from_db(pincode)

    for row in data:
        if isinstance(row['Sanction_Date'], (datetime, date)):
            row['Sanction_Date'] = row['Sanction_Date'].isoformat()
        if isinstance(row['Completion_Date'], (datetime, date)):
            row['Completion_Date'] = row['Completion_Date'].isoformat()

    print(json.dumps({'clashes': data}, indent=4))

if __name__ == '__main__':
    main()