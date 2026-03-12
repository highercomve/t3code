import re

files = [
    "geminiAppServerManager.ts",
    "provider/Layers/GeminiAdapter.ts"
]

for fpath in files:
    with open(fpath, "r") as f:
        text = f.read()

    text = text.replace("Codex", "Gemini")
    text = text.replace("codex", "gemini")
    text = text.replace("CODEX", "GEMINI")
    
    # In GeminiAppServerManager, change the spawn args from 'app-server' to '--experimental-acp'
    text = text.replace('spawn(geminiBinaryPath, ["app-server"]', 'spawn(geminiBinaryPath, ["--experimental-acp"]')

    with open(fpath, "w") as f:
        f.write(text)
