## FreshDevice

```
Project's backend
Main dev: Say Domonkos
```

- # DeviceCategoryController

  - ### /device-categories
    Method: **PATCH**
    Description: `Add new deviceCategory`
    Request body:

      ```json
      {
        "parentCategoryID": "string",
        "categoryName": "string",
        "defaultMaintanceSchedule": "string",
        "maintanceRequirements": [
          {
            "requirementName": "string",
            "steps": ["string"]
          }
        ]
      }
      ```

    Required: `categoryName`
    Responds:

    ```typescript
    'Error: defaultMaintanceSchedule was given and cannot fetch it from undefined parentID';
    'success';
    ```
  
  - ### /device-categories
    Method: **GET**
    Description: `Get DeviceCategorys hirearchy model`
    Responds:
    ```json
    [
      {
        "categoryID": "1j5w1gar7z80hupky9teoy",
        "categoryName": "0",
        "childrens": [
          {
            "categoryID": "1j6bguckhyq0ui9flez8v7j",
            "categoryName": "1",
            "childrens": [
              {
                "categoryID": "1j7fgl731vf0rnpzf1flwq",
                "categoryName": "2",
                "childrens": []
              }
            ]
          },
          {
            "categoryID": "1j7y5yrjvus0fkqtogmaiy",
            "categoryName": "3",
            "childrens": []
          }
        ]
      }
    ]
    ```
  - ### /device-categories/${parentCategoryID}
    Method: **PATCH**
    Description: `Insert category inside a tree`
    Request:
    ```json
    {
      "whichChildID": "string",
      "categoryName": "string",
      "defaultMaintanceSchedule": "string",
      "maintanceRequirements": [
        {
          "requirementName": "string",
          "steps": [
            "string"
          ]
        }
      ]
    }
    ```
    Responds:
    ```typescript
    'Unexpected error: Category not found by ID'
    DevicesCategorys Model
    ```
  - ### /device-categories/${categoryID}
    Method: **DELETE**
    Description: `Delete category`
    Respond:
    ```typescript
    'Unexpected error: category not found by ID'
    'Deleted root with ID: ' + categoryID
    'Deleted leaf with ID: ' + categoryID
    'Succesfully deleted ' + categoryName + ' from tree'
    ```
  - ### /device-categories/${categoryID}
    Method: **GET**
    Description: `Get device info by ID`
    Respond:
    ```json
    {
      "categoryName": "1",
      "defaultMaintanceSchedule": "testSchedule",
      "maintanceRequirements": []
    }
    ```
  - ### /device-categories/${categoryID}
    Method: **PATCH**
    Description: `Update deviceCategory data by ID`
    Request:
    ```json
        {
      "categoryName": "string",
      "defaultMaintanceSchedule": "string",
      "maintanceRequirements": [
        {
          "requirementName": "string",
          "steps": [
            "string"
          ]
        }
      ]
    }
    ```
    Respond:
    ```typescript
    'Unexpected error: Category not found by ID'
    DeviceCategorys Model
    ```
  - ### /test
    Method: **PUT**
    Description: `Make test categories by n times`
    Request:
    ```json
    {
        "n": number
    }
    ```
    Respond:
    ```typescript
    'success'
    ```
  - ### /test
    Method: **DELETE**
    Description: `Drop all dump test category`

- # DeviceController
    - ### /devices
        Method: **POST**
        Description: `Add new device`
        Request:
        ```json
        {
          "deviceName": "string",
          "categoryID": "string",
          "productID": "string",
          "location": "string",
          "description": "string"
        }
        ```
    
        Required: `deviceName, categoryID, productID, location, description`
        Responds:
        ```typescript
        Device model
        ```
    - ### /devices
        Method: **GET**
        Description: `Get list of devices`
        Responds:
        ```json
        [
          {
            "deviceID": "2fejo9t3ac80s1jrdnn258",
            "deviceName": "string"
          },
          {
            "deviceID": "2fgjd8ra6wd0mocicbqi21l",
            "deviceName": "string"
          },
          {
            "deviceID": "2fikhziglr50nrvzkfovd09",
            "deviceName": "string"
          }
        ]
        ```
    - ### /devices/${deviceID}
        Method: **GET**
        Description: `Get device info by ID`
        Responds:
        ```json
        {
          "deviceName": "test Device name",
          "categoryPath": "0 >> 1 >> 2",
          "professions": "test profession",
          "productID": "test productNumber value",
          "location": "THISlocation",
          "description": "this is a test for the API Documentation"
        }
        ```
     - ### /devices/${deviceID}
        Method: **PATCH**
        Description: `Update device by ID`
        Request:
        ```json
        {
          "deviceName": "string",
          "categoryID": "string",
          "productID": "string",
          "location": "string",
          "description": "string"
        }
        ```
        Responds:
        ```typescript
        Device model
        'Unexpected error: Device not found by ID'
        ```
    - ### /devices/${deviceID}
        Method: **DELETE**
        Description: `Delete device by ID`
        Responds:
        ```typescript
        'Succesfully deleted' + deviceName
        'Device not found by ID'
        ```
- # ProfessionController
    - ### /professions
        Method: **POST**
        Description: `Add new profession`
        Request:
        ```json
        {
          "professionName": "test profession",
          "selectedCategoryID": "1j7fgl731vf0rnpzf1flwq"
        }
        Required: `professionName, selectedCategoryID`
        ```
        Responds:
        ```typescript
        Profession model
        'Unexpected error: selected category not found'
        ```
    - ### /professions
        Method: **GET**
        Description: `Get list of professions` 
        Respond:
        ```json
        [
          {
            "professionID": "3p6cb5w7n4e0w7je7c5r8tl",
            "professionName": "test profession"
          },
          {
            "professionID": "40xot2drvsy0fwjbn476s3a",
            "professionName": "test profession2"
          },
          {
            "professionID": "4qs17dn4kle01gosb9yb281i",
            "professionName": "test profession3"
          }
        ]
    - ### /professions/${professionID}
        Method: **GET**
        Description: `Get profession info by ID` 
        Respond:
        ```json
        {
          "professionName": "test profession",
          "categoriesKnown": [
            "2"
          ]
        }
        ```
    - ### /professions/${professionID}
        Method: **PATCH**
        Description: `Update profession by ID` 
        Request:
        ```json
        {
          "professionName": "string"
        }
        ```
        Respond:
        ```typescript
        Profession model
        'Unexpected error: Profession not found by ID'
        ```
    - ### /professions/${professionID}
        Method: **DELETE**
        Description: `Delete profession by ID` 
        Respond:
        ```typescript
        'Succesfully deleted' + professionName + 'profession'
        'Unexpected error: Profession not found by ID'
        ```
- # UserController
    - ### /signup
        Method: **Post**
        Description: `Register` 
        Request:
        ```json
        {
          "email": "string",
          "username": "string",
          "password": "string",
          "role": "string"
        }
        ```
        Required: `email, username, password, role`
        Responds:
        ```json
        {
          "id": "acabd4a3-f7fc-4e77-8f9e-993ec99e72fc",
          "username": "string",
          "email": "string@string.com",
          "role": "string"
        }
        "This username is already in use"
        ```
    - ### /login
        Method: **Post**
        Description: `Login` 
        Request:
        ```json
        {
          "email": "string",
          "username": "string",
          "password": "string"
        }
        ```
        Required: `password`
        Responds:
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjYWJkNGEzLWY3ZmMtNGU3Ny04ZjllLTk5M2VjOTllNzJmYyIsIm5hbWUiOiJzdHJpbmciLCJlbWFpbCI6InN0cmluZ0BzdHJpbmcuY29tIiwiaWF0IjoxNjQ4MzA2OTYzLCJleHAiOjE2NDgzMjg1NjN9.89ACyHPRQywcFOPWqynfYKumsze0VoOWKLRv9Cw64DU"
        }
        "username not found"
        "Unexcepted error: email and username was not given or found"
        ```
