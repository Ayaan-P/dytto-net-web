#!/usr/bin/env python3
"""
Script to run the Flask backend server for Dytto.
This script ensures all dependencies are installed and starts the server.
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required Python packages."""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        sys.exit(1)

def check_env_file():
    """Check if .env file exists and has required variables."""
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Please create a .env file with the following variables:")
        print("SUPABASE_URL=your_supabase_url")
        print("SUPABASE_KEY=your_supabase_key")
        print("ANTHROPIC_API_KEY=your_anthropic_api_key")
        sys.exit(1)
    
    # Read and check for required variables
    with open(env_file, 'r') as f:
        env_content = f.read()
    
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY', 'ANTHROPIC_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if var not in env_content or f"{var}=" not in env_content:
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        sys.exit(1)
    
    print("✅ Environment file looks good!")

def run_server():
    """Start the Flask development server."""
    print("Starting Flask backend server...")
    print("🚀 Server will be available at: http://127.0.0.1:5000")
    print("📊 Dashboard API: http://127.0.0.1:5000/dashboard_data")
    print("👥 Relationships API: http://127.0.0.1:5000/relationships")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        # Set Flask environment variables
        os.environ['FLASK_APP'] = 'app.py'
        os.environ['FLASK_ENV'] = 'development'
        os.environ['FLASK_DEBUG'] = 'true'  # Enable debug mode for better error messages
        
        # Run the Flask app
        subprocess.run([sys.executable, "app.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running server: {e}")
        print("💡 Check the error messages above for more details about what went wrong.")
        sys.exit(1)

def main():
    """Main function to set up and run the backend."""
    print("🔧 Setting up Dytto Backend Server")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ app.py not found! Please run this script from the project root directory.")
        sys.exit(1)
    
    # Install dependencies
    install_requirements()
    
    # Check environment file
    check_env_file()
    
    # Run the server
    run_server()

if __name__ == "__main__":
    main()