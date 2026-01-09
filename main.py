import pandas as pd
from datetime import datetime
import os
import sys

# Test Case Data for Purchase Order App Login
test_cases = [
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_001",
        "Test Case Title": "Verify Login Page Elements Display",
        "Preconditions": "1. User is on login page\n2. Browser is properly loaded",
        "Test Steps": """1. Navigate to the login page
2. Check if username field is displayed
3. Check if password field is displayed
4. Check if login button is displayed
5. Check if 'Forgot Password' link is displayed
6. Check if 'Remember Me' checkbox is displayed""",
        "Expected Result": "All login page elements should be properly displayed",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "UI validation test"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_002",
        "Test Case Title": "Verify Successful Login with Valid Credentials",
        "Preconditions": "1. User has valid credentials\n2. User is on login page",
        "Test Steps": """1. Enter valid username in username field
2. Enter valid password in password field
3. Click on 'Login' button""",
        "Expected Result": "User should be logged in successfully and redirected to dashboard",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Positive test case"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_003",
        "Test Case Title": "Verify Login with Invalid Username",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Enter invalid username
2. Enter valid password
3. Click on 'Login' button""",
        "Expected Result": "Error message should appear: 'Invalid username or password'",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Negative test case - invalid username"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_004",
        "Test Case Title": "Verify Login with Invalid Password",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Enter valid username
2. Enter invalid password
3. Click on 'Login' button""",
        "Expected Result": "Error message should appear: 'Invalid username or password'",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Negative test case - invalid password"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_005",
        "Test Case Title": "Verify Login with Blank Password",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Enter valid username
2. Leave password field blank
3. Click on 'Login' button""",
        "Expected Result": "Validation error should appear for blank password field",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Validation test - blank password"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_006",
        "Test Case Title": "Verify Login with Blank Username",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Leave username field blank
2. Enter valid password
3. Click on 'Login' button""",
        "Expected Result": "Validation error should appear for blank username field",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Validation test - blank username"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_007",
        "Test Case Title": "Verify Login with Both Fields Blank",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Leave username field blank
2. Leave password field blank
3. Click on 'Login' button""",
        "Expected Result": "Validation errors should appear for both fields",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Validation test - both fields blank"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_008",
        "Test Case Title": "Verify Password Field Masks Input",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Click on password field
2. Enter any text/characters""",
        "Expected Result": "Password should be masked (shown as asterisks or dots)",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "Security test - password masking"
    },
    {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": "TC_LOGIN_009",
        "Test Case Title": "Verify Login Button State Changes",
        "Preconditions": "1. User is on login page",
        "Test Steps": """1. Observe login button with empty fields
2. Enter username only - observe button
3. Enter password only - observe button
4. Enter both fields - observe button""",
        "Expected Result": "Login button should be enabled only when both fields have input",
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": "UI state validation"
    }
]

def check_file_permission(filename):
    """Check if file can be written"""
    try:
        # Try to create or open the file
        with open(filename, 'a') as f:
            pass
        return True
    except PermissionError:
        return False
    except Exception:
        return True  # File doesn't exist yet, so we can create it

def export_to_excel(test_cases, filename=None):
    """
    Export test cases to Excel file
    
    Args:
        test_cases (list): List of test case dictionaries
        filename (str): Output Excel filename
    """
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"Purchase_Order_App_Login_Test_Cases_{timestamp}.xlsx"
    
    try:
        # Check if file exists and is accessible
        if os.path.exists(filename):
            if not check_file_permission(filename):
                # File is locked, create new one with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                base_name = os.path.splitext(filename)[0]
                filename = f"{base_name}_{timestamp}.xlsx"
                print(f"⚠ Original file is locked. Creating new file: {filename}")
        
        # Create DataFrame from test cases
        df = pd.DataFrame(test_cases)
        
        # Create Excel writer object
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            # Write test cases to Excel
            df.to_excel(writer, sheet_name='Login Test Cases', index=False)
            
            # Auto-adjust column widths
            worksheet = writer.sheets['Login Test Cases']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if cell.value and len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
            
            print(f"✓ Test cases exported successfully to: {filename}")
            print(f"✓ Total test cases: {len(test_cases)}")
            print(f"✓ File saved at: {os.path.abspath(filename)}")
            return True
            
    except PermissionError as e:
        print(f"\n✗ PERMISSION ERROR: Cannot write to {filename}")
        print(f"  Error: {str(e)}")
        print("\n  SOLUTIONS:")
        print("  1. Close Excel if the file is open")
        print("  2. Check if file is read-only")
        print("  3. Try a different filename")
        print("  4. Run as administrator")
        return False
        
    except Exception as e:
        print(f"\n✗ ERROR exporting to Excel: {str(e)}")
        print(f"  Error type: {type(e).__name__}")
        return False

def display_test_summary(test_cases):
    """Display test case summary"""
    print("\n" + "="*80)
    print("PURCHASE ORDER APP - LOGIN FUNCTIONALITY TEST CASES")
    print("="*80)
    
    print(f"\nTotal Test Cases Created: {len(test_cases)}")
    print("\nTest Case Summary:")
    print("-" * 40)
    
    for tc in test_cases:
        print(f"{tc['Test Case ID']}: {tc['Test Case Title']}")
    
    print("\n" + "="*80)

def display_detailed_test_cases(test_cases):
    """Display detailed test cases"""
    print("\n" + "="*100)
    print("PURCHASE ORDER APP - DETAILED TEST CASES")
    print("="*100)
    
    for idx, tc in enumerate(test_cases, 1):
        print(f"\n{'='*80}")
        print(f"TEST CASE {idx}: {tc['Test Case ID']} - {tc['Test Case Title']}")
        print(f"{'='*80}")
        print(f"Date: {tc['Date']}")
        print(f"Test Case ID: {tc['Test Case ID']}")
        print(f"Preconditions:\n{tc['Preconditions']}")
        print(f"Test Steps:\n{tc['Test Steps']}")
        print(f"Expected Result: {tc['Expected Result']}")
        print(f"Actual Result: {tc['Actual Result']}")
        print(f"Status: {tc['Status']}")
        print(f"Comments: {tc['Comments']}")
        print(f"{'-'*80}")

def add_new_test_case():
    """Add a new test case manually"""
    print("\n" + "="*80)
    print("ADD NEW TEST CASE")
    print("="*80)
    
    tc_id = input("Enter Test Case ID (e.g., TC_LOGIN_010): ").strip()
    title = input("Enter Test Case Title: ").strip()
    
    print("\nEnter Preconditions (press Enter twice to finish):")
    preconditions_lines = []
    while True:
        line = input()
        if not line and preconditions_lines:
            break
        if line:
            preconditions_lines.append(line)
    preconditions = "\n".join(preconditions_lines)
    
    print("\nEnter Test Steps (press Enter twice to finish):")
    steps_lines = []
    while True:
        line = input()
        if not line and steps_lines:
            break
        if line:
            steps_lines.append(line)
    test_steps = "\n".join(steps_lines)
    
    expected_result = input("\nEnter Expected Result: ").strip()
    comments = input("Enter Comments: ").strip()
    
    new_tc = {
        "Date": datetime.now().strftime("%Y-%m-%d"),
        "Test Case ID": tc_id,
        "Test Case Title": title,
        "Preconditions": preconditions,
        "Test Steps": test_steps,
        "Expected Result": expected_result,
        "Actual Result": "",
        "Status": "Not Executed",
        "Comments": comments
    }
    
    test_cases.append(new_tc)
    print(f"\n✓ New test case '{tc_id}' added successfully!")
    return test_cases

def close_open_excel_files():
    """Display instructions to close Excel files"""
    print("\n" + "="*80)
    print("CLOSING EXCEL FILES INSTRUCTIONS")
    print("="*80)
    print("\nIf you're getting 'Permission denied' errors:")
    print("\n1. Open Task Manager (Ctrl + Shift + Esc)")
    print("2. Look for 'Excel' or 'Microsoft Excel' in Processes tab")
    print("3. Select it and click 'End Task'")
    print("4. Also check for any Python processes that might be holding the file")
    print("\n5. Alternative: Save with a different filename")
    print("6. Alternative: Save to a different directory")

def clear_directory_files():
    """Clear specific Excel files from directory"""
    print("\n" + "="*80)
    print("CLEARING EXCEL FILES FROM DIRECTORY")
    print("="*80)
    
    current_dir = os.getcwd()
    files_to_delete = []
    
    # Find Excel files
    for file in os.listdir(current_dir):
        if file.endswith('.xlsx') and ('Purchase_Order' in file or 'Test_Cases' in file):
            files_to_delete.append(file)
    
    if not files_to_delete:
        print("No test case Excel files found in directory.")
        return
    
    print(f"\nFound {len(files_to_delete)} Excel file(s):")
    for i, file in enumerate(files_to_delete, 1):
        print(f"{i}. {file}")
    
    choice = input("\nDelete all files? (yes/no): ").lower()
    if choice in ['yes', 'y']:
        deleted_count = 0
        for file in files_to_delete:
            try:
                os.remove(file)
                print(f"✓ Deleted: {file}")
                deleted_count += 1
            except PermissionError:
                print(f"✗ Cannot delete {file} (file is open or locked)")
            except Exception as e:
                print(f"✗ Error deleting {file}: {str(e)}")
        
        print(f"\nTotal files deleted: {deleted_count}")
    else:
        print("No files deleted.")

def main_menu():
    """Display main menu"""
    global test_cases
    
    # First display summary
    display_test_summary(test_cases)
    
    while True:
        print("\n" + "="*80)
        print("PURCHASE ORDER APP TEST CASE MANAGER")
        print("="*80)
        print("1. View Detailed Test Cases")
        print("2. Export to Excel (Default name)")
        print("3. Export to Excel (Custom name)")
        print("4. Add New Test Case")
        print("5. Fix Permission Issues")
        print("6. Clear Existing Files")
        print("7. Exit")
        
        choice = input("\nEnter your choice (1-7): ").strip()
        
        if choice == "1":
            display_detailed_test_cases(test_cases)
        elif choice == "2":
            success = export_to_excel(test_cases, "Purchase_Order_App_Login_Test_Cases.xlsx")
            if not success:
                print("\nTrying alternative filename...")
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                alt_filename = f"Purchase_Order_Test_Cases_{timestamp}.xlsx"
                export_to_excel(test_cases, alt_filename)
        elif choice == "3":
            custom_name = input("Enter Excel filename (without .xlsx): ").strip()
            if custom_name:
                filename = f"{custom_name}.xlsx"
                export_to_excel(test_cases, filename)
            else:
                print("Invalid filename. Using default.")
                export_to_excel(test_cases)
        elif choice == "4":
            test_cases = add_new_test_case()
            display_test_summary(test_cases)
        elif choice == "5":
            close_open_excel_files()
        elif choice == "6":
            clear_directory_files()
        elif choice == "7":
            print("\nExiting... Goodbye!")
            sys.exit(0)
        else:
            print("Invalid choice! Please enter 1-7")

def quick_export():
    """Quick export without menu - for direct execution"""
    print("\n" + "="*80)
    print("PURCHASE ORDER APP - QUICK EXPORT")
    print("="*80)
    
    display_test_summary(test_cases)
    
    # Try default name first
    default_file = "Purchase_Order_App_Login_Test_Cases.xlsx"
    
    if os.path.exists(default_file):
        print(f"\n⚠ File '{default_file}' already exists.")
        choice = input("Overwrite? (yes/no): ").lower()
        if choice not in ['yes', 'y']:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            default_file = f"Purchase_Order_App_Login_Test_Cases_{timestamp}.xlsx"
            print(f"Using new filename: {default_file}")
    
    success = export_to_excel(test_cases, default_file)
    
    if not success:
        print("\nTrying with automatic timestamp...")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        new_file = f"Purchase_Order_Test_{timestamp}.xlsx"
        export_to_excel(test_cases, new_file)

if __name__ == "__main__":
    print("Purchase Order App Login Test Case Generator")
    print("="*60)
    
    # Check if file exists and might be locked
    default_file = "Purchase_Order_App_Login_Test_Cases.xlsx"
    if os.path.exists(default_file):
        try:
            with open(default_file, 'a'):
                pass
            print(f"✓ File '{default_file}' is accessible")
        except PermissionError:
            print(f"⚠ WARNING: '{default_file}' is open/locked")
            print("  Please close Excel before running this script")
    
    # Ask user what they want to do
    print("\nOptions:")
    print("1. Quick export to Excel")
    print("2. Open full test case manager")
    
    option = input("\nChoose option (1 or 2): ").strip()
    
    if option == "1":
        quick_export()
    else:
        main_menu()