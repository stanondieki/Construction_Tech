import requests
import json

# Test login and dashboard API calls

BASE_URL = "http://127.0.0.1:8000/api"

def test_login_and_dashboard():
    print("Testing login and dashboard API...")
    
    # 1. Test login
    print("\n1. Testing login...")
    login_data = {
        "email": "admin@ujenziiq.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/jwt/create/", json=login_data)
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            login_result = response.json()
            token = login_result.get('access')
            print(f"✅ Login successful! Token: {token[:20]}...")
            
            # Headers for authenticated requests
            headers = {
                "Authorization": f"JWT {token}",
                "Content-Type": "application/json"
            }
            
            # 2. Test user profile
            print("\n2. Testing user profile...")
            user_response = requests.get(f"{BASE_URL}/auth/users/me/", headers=headers)
            print(f"User profile status: {user_response.status_code}")
            if user_response.status_code == 200:
                user_data = user_response.json()
                print(f"✅ User: {user_data.get('username')} ({user_data.get('email')})")
            else:
                print(f"❌ User profile failed: {user_response.text}")
            
            # 3. Test my projects
            print("\n3. Testing my projects...")
            projects_response = requests.get(f"{BASE_URL}/projects/my_projects/", headers=headers)
            print(f"My projects status: {projects_response.status_code}")
            if projects_response.status_code == 200:
                projects_data = projects_response.json()
                print(f"✅ Found {len(projects_data)} projects")
                for project in projects_data[:3]:  # Show first 3
                    print(f"  - {project.get('name')} (Status: {project.get('status')})")
            else:
                print(f"❌ My projects failed: {projects_response.text}")
            
            # 4. Test my tasks
            print("\n4. Testing my tasks...")
            tasks_response = requests.get(f"{BASE_URL}/tasks/my_tasks/", headers=headers)
            print(f"My tasks status: {tasks_response.status_code}")
            if tasks_response.status_code == 200:
                tasks_data = tasks_response.json()
                print(f"✅ Found {len(tasks_data)} tasks")
                for task in tasks_data[:3]:  # Show first 3
                    print(f"  - {task.get('name')} (Status: {task.get('status')})")
            else:
                print(f"❌ My tasks failed: {tasks_response.text}")
            
            # 5. Test safety incidents
            print("\n5. Testing safety incidents...")
            safety_response = requests.get(f"{BASE_URL}/safety/", headers=headers)
            print(f"Safety incidents status: {safety_response.status_code}")
            if safety_response.status_code == 200:
                safety_data = safety_response.json()
                if isinstance(safety_data, dict) and 'results' in safety_data:
                    incidents = safety_data['results']
                else:
                    incidents = safety_data
                print(f"✅ Found {len(incidents)} safety incidents")
            else:
                print(f"❌ Safety incidents failed: {safety_response.text}")
                
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login_and_dashboard()
