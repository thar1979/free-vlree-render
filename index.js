const express = require('express');
const { WebSocketServer } = require('ws');

const app = express();
const port = process.env.PORT || 3000;

// Auto UUID generate
const userID = require('crypto').randomUUID();
const credit = "Render-VLESS";

// Home page
app.get('/', (req, res) => {
  const host = req.headers.host;
  const vlessURL = `vless://${userID}@${host}:443?encryption=none&security=tls&sni=${host}&fp=chrome&type=ws&host=${host}&path=%2Fws#${credit}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🚀 Free VLESS - Render</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.95);
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        }
        .btn { 
            display: inline-block; 
            background: #28a745; 
            color: white; 
            padding: 15px 25px; 
            border-radius: 8px; 
            text-decoration: none; 
            margin: 10px;
            font-weight: bold;
            border: none;
            cursor: pointer;
        }
        .config-box { 
            background: #fff3cd; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
            border-left: 5px solid #ffc107;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin: 0;
        }
        .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="text-align: center; color: #2c3e50;">🚀 Free VLESS Server</h1>
        
        <div class="status">
            🟢 SERVER ONLINE - READY TO USE
        </div>
        
        <p><strong>Server:</strong> ${host}</p>
        <p><strong>UUID:</strong> ${userID}</p>
        <p><strong>Port:</strong> 443</p>
        <p><strong>Path:</strong> /ws</p>
        
        <div class="config-box">
            <strong>📋 VLESS Configuration:</strong><br><br>
            <pre id="config">${vlessURL}</pre>
        </div>
        
        <div style="text-align: center;">
            <button class="btn" onclick="copyConfig()">📋 Copy Config</button>
        </div>
        
        <script>
            function copyConfig() {
                const config = document.getElementById('config').innerText;
                navigator.clipboard.writeText(config).then(() => {
                    alert('✅ VLESS Config Copied!\\\\nPaste in V2RayNG app.');
                });
            }
        </script>
    </div>
</body>
</html>
  `;
  res.send(html);
});

// Start server
const server = app.listen(port, () => {
  console.log('🚀 VLESS Server started successfully!');
  console.log('🔑 UUID:', userID);
  console.log('🌐 Server URL: https://your-app-name.onrender.com');
});

// WebSocket for VLESS
const wss = new WebSocketServer({ 
  server, 
  path: '/ws' 
});

wss.on('connection', (ws) => {
  console.log('✅ Client connected');
  
  ws.on('message', (data) => {
    console.log('📨 Received WebSocket data');
    // Send VLESS response
    const response = Buffer.from([0x01, 0x00]);
    ws.send(response);
  });
  
  ws.on('close', () => {
    console.log('🔌 Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.log('⚠️ WebSocket error:', error);
  });
});
