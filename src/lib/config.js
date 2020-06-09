exports.settings = {
    "appName": "EFApp",
    "appVer": "1.0.1",
    "debug": true,
    "escapeRegister": true,
    "uri": "https://it-minsk.by",
    "delay": 5000,
    "savelogs": false,
    "storage": {
        "dataPath": "../tmp",
        "dateFormat": "Y-m-d H:i:s", //  Y-m-d H:i:s
    },
    "files": {
        "imagePath": "../assets/upload",
        "encoding": "utf8",
    },
    "logs": {
        "filePath": "../logs",
        "logFile": "/efapplogs.log",
        "errorFile": "/efapperrors.log",
        "encoding": "utf8",
        "dateFormat": "[d/N/Y:H:i:s O]", //  Y-m-d H:i:s
        "pretty": true,
    },
    "nedb": {
        "filePath": "../data",
        "dateFormat": "Y-m-d H:i:s",
        "collections": [
          {
            "name": "guests",
            "database": "/nedb.efapp_data.db",
            "index": ["creation"],
            "unique": ["hash","file"]
          }
        ]
    }
};
