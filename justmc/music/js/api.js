export async function uploadMusic(musicData, metadata) {
    const json = generateJson(musicData, metadata)
    console.log(json)

    const response = await fetch('https://m.justmc.ru/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json
    });
    
    const data = await response.json();
    
    if (data && data.id) {
        return {
            success: true,
            url: `https://m.justmc.ru/api/download/${data.id}`
        };
    } else {
        return {
            success: false,
            error: JSON.stringify(data)
        };
    }
}

function replaceValues(obj, replacements) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            replaceValues(obj[key], replacements);
        } else if (typeof obj[key] === 'string') {
            for (let [placeholder, value] of Object.entries(replacements)) {
                if (obj[key] === placeholder) {
                    obj[key] = value;
                }
            }
        }
    }
    return obj;
}

function splitMusicData(musicData, maxLength = 10000) {
    const result = [];
    
    for (let i = 0; i < musicData.length; i += maxLength) {
        const chunk = musicData.slice(i, i + maxLength);
        result.push({"type": "text", "parsing": "legacy",
                     "text": chunk});
    }
    
    return result;
}

// Использование
function generateJson(musicData, metadata) {
    let result = original;

    // Затем заменяем все плейсхолдеры
    replaceValues(result, {
        'MUSIC_LIST': splitMusicData(musicData, 10000),
        'MUSIC_NAME': metadata.name,
        'MUSIC_AUTHOR': metadata.author,
        'MUSIC_ICON': metadata.icon || 'note_block',
        'MUSIC_TEMP': metadata.tempo,
        'MUSIC_LENGTH': metadata.duration
    });

    return JSON.stringify({"handlers": [result]})
}

const original = {
  "type": "event",
  "position": 0,
  "operations": [
    {
      "action": "if_player_has_privilege",
      "values": [
        {
          "name": "privilege",
          "value": {
            "type": "enum",
            "enum": "OWNER"
          }
        }
      ],
      "operations": [
        {
          "action": "set_variable_value",
          "values": [
            {
              "name": "variable",
              "value": {
                "type": "variable",
                "variable": "music",
                "scope": "line"
              }
            },
            {
              "name": "value",
              "value": {
                "type": "array",
                "values":  "MUSIC_LIST"
              }
            }
          ]
        },
        {
          "action": "call_function",
          "values": [
            {
              "name": "function_name",
              "value": {
                "type": "text",
                "text": "musicNew",
                "parsing": "plain"
              }
            },
            {
              "name": "args",
              "value": {
                "type": "map",
                "values": {
                  "{\"type\":\"text\",\"text\":\"name\",\"parsing\":\"plain\"}": {
                    "type": "text",
                    "text": "MUSIC_NAME",
                    "parsing": "legacy"
                  },
                  "{\"type\":\"text\",\"text\":\"author\",\"parsing\":\"plain\"}": {
                    "type": "text",
                    "text": "MUSIC_AUTHOR",
                    "parsing": "legacy"
                  },
                  "{\"type\":\"text\",\"text\":\"icon\",\"parsing\":\"plain\"}": {
                    "type": "text",
                    "text": "MUSIC_ICON",
                    "parsing": "legacy"
                  },
                  "{\"type\":\"text\",\"text\":\"music\",\"parsing\":\"plain\"}": {
                    "type": "variable",
                    "variable": "music",
                    "scope": "line"
                  },
                  "{\"type\":\"text\",\"text\":\"temp\",\"parsing\":\"plain\"}": {
                    "type": "number",
                    "number": "MUSIC_TEMP"
                  },
                  "{\"type\":\"text\",\"text\":\"length\",\"parsing\":\"plain\"}": {
                    "type": "number",
                    "number": "MUSIC_LENGTH"                    
                  }
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "event": "player_join"
}