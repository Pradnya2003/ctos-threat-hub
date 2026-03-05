import asyncio
from context.database import connect_to_mongo, get_database, close_mongo_connection

async def test_mongodb_connection():
    """Test MongoDB connection status"""
    print("Testing MongoDB connection...")
    
    try:
        # Try to connect
        await connect_to_mongo()
        
        # Check if database is available
        db = get_database()
        
        if db is not None:
            print("✅ MongoDB is connected!")
            
            # Test basic operations
            try:
                # List collections to verify database access
                collections = await db.list_collection_names()
                print(f"📁 Collections found: {collections}")
                
                # Test ping command
                result = await db.command('ping')
                print(f"🏓 Ping successful: {result}")
                
            except Exception as e:
                print(f"⚠️  Connected but operations failed: {e}")
        else:
            print("❌ Database connection failed - database is None")
            
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("   Check if:")
        print("   - MongoDB is running")
        print("   - Connection string in .env is correct")
        print("   - Network access is available")
    
    finally:
        # Close connection
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())
