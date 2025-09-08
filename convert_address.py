#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert vietnamAddress.json to JavaScript file to avoid CORS issues
"""

import json
import os

def convert_json_to_js():
    """Convert JSON file to JavaScript file"""
    
    # Read the JSON file
    json_file_path = 'data/vietnamAddress.json'
    js_file_path = 'data/vietnamAddressFull.js'
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"Loaded {len(data)} provinces from JSON file")
        
        # Create JavaScript content
        js_content = '''// Dữ liệu địa chỉ Việt Nam đầy đủ
// Auto-generated from vietnamAddress.json to avoid CORS issues

const VIETNAM_ADDRESS_DATA_FULL = '''
        
        # Add the JSON data as JavaScript
        js_content += json.dumps(data, ensure_ascii=False, indent=2)
        
        js_content += ''';

// Export for use in main script
window.VIETNAM_ADDRESS_DATA_FULL = VIETNAM_ADDRESS_DATA_FULL;

console.log('Loaded', VIETNAM_ADDRESS_DATA_FULL.length, 'provinces');
'''
        
        # Write to JavaScript file
        with open(js_file_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"Successfully converted to {js_file_path}")
        print(f"File size: {os.path.getsize(js_file_path) / 1024:.1f} KB")
        
        return True
        
    except FileNotFoundError:
        print(f"Error: {json_file_path} not found")
        return False
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Converting vietnamAddress.json to JavaScript...")
    success = convert_json_to_js()
    
    if success:
        print("✅ Conversion completed successfully!")
        print("Now you can use the full address data without CORS issues.")
    else:
        print("❌ Conversion failed!")
