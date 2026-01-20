# How to Export Kilo Code Conversation Prompts

## Location of Conversation History

Kilo Code stores all conversation history in VS Code's global storage:

**Windows Path:**
```
C:\Users\Kevin\AppData\Roaming\Code\User\globalStorage\kilocode.kilo-code\tasks\
```

**WSL Path (from Linux):**
```
/mnt/c/Users/Kevin/AppData/Roaming/Code/User/globalStorage/kilocode.kilo-code/tasks/
```

## File Structure

Each task/conversation is stored as a folder with:
- A unique task ID as the folder name (e.g., `1737234567890`)
- Inside each folder: `api_conversation_history.json` - contains the full conversation

## Manual Export Steps

### Option 1: Using Windows File Explorer

1. Press `Win + R` and paste:
   ```
   %APPDATA%\Code\User\globalStorage\kilocode.kilo-code\tasks
   ```

2. You'll see folders for each conversation (named with timestamps/IDs)

3. Open each folder and find `api_conversation_history.json`

4. The JSON structure contains an array of messages. User prompts have `"role": "user"`

### Option 2: Using PowerShell (Recommended)

Run this PowerShell script to extract all user prompts to a text file:

```powershell
$tasksPath = "$env:APPDATA\Code\User\globalStorage\kilocode.kilo-code\tasks"
$outputFile = "$env:USERPROFILE\Desktop\kilo-code-prompts.txt"

# Clear or create output file
"" | Out-File $outputFile

Get-ChildItem $tasksPath -Directory | ForEach-Object {
    $historyFile = Join-Path $_.FullName "api_conversation_history.json"
    if (Test-Path $historyFile) {
        $taskId = $_.Name
        $content = Get-Content $historyFile -Raw | ConvertFrom-Json
        
        "=" * 80 | Add-Content $outputFile
        "Task ID: $taskId" | Add-Content $outputFile
        "=" * 80 | Add-Content $outputFile
        
        $content | Where-Object { $_.role -eq "user" } | ForEach-Object {
            "`n--- User Prompt ---" | Add-Content $outputFile
            
            # Handle different content formats
            if ($_.content -is [string]) {
                $_.content | Add-Content $outputFile
            } elseif ($_.content -is [array]) {
                $_.content | ForEach-Object {
                    if ($_.type -eq "text") {
                        $_.text | Add-Content $outputFile
                    }
                }
            }
        }
        "`n" | Add-Content $outputFile
    }
}

Write-Host "Prompts exported to: $outputFile"
```

### Option 3: Using WSL/Bash

Run this from your WSL terminal:

```bash
TASKS_PATH="/mnt/c/Users/Kevin/AppData/Roaming/Code/User/globalStorage/kilocode.kilo-code/tasks"
OUTPUT_FILE="$HOME/kilo-code-prompts.txt"

echo "" > "$OUTPUT_FILE"

for task_dir in "$TASKS_PATH"/*/; do
    history_file="$task_dir/api_conversation_history.json"
    if [ -f "$history_file" ]; then
        task_id=$(basename "$task_dir")
        echo "================================================================================" >> "$OUTPUT_FILE"
        echo "Task ID: $task_id" >> "$OUTPUT_FILE"
        echo "================================================================================" >> "$OUTPUT_FILE"
        
        # Extract user messages using jq
        jq -r '.[] | select(.role == "user") | "\n--- User Prompt ---\n" + (if .content | type == "string" then .content else (.content[] | select(.type == "text") | .text) end)' "$history_file" >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
    fi
done

echo "Prompts exported to: $OUTPUT_FILE"
```

**Note:** The bash script requires `jq` to be installed. Install with: `sudo apt install jq`

## Filtering by Project

If you only want prompts from the `golf-app-claude` project, look for conversations where the working directory matches. The task metadata is stored in the folder, and you can filter by checking the conversation content for references to your project path.

## Tips

- Task folders are named with timestamps, so newer conversations have higher numbers
- The `api_conversation_history.json` contains the full back-and-forth, not just prompts
- Assistant responses have `"role": "assistant"`
- System messages have `"role": "system"`
