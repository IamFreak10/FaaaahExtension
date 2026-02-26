import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  let lastPlay = 0;
  const cooldown = 4000; // 4 seconds

  function playSound() {
    const now = Date.now();
    if (now - lastPlay < cooldown) return;
    lastPlay = now;

    const soundFile = path.join(context.extensionPath, 'media', 'faaaaah.mp3');

    // Platform specific "Silent" play
    if (process.platform === 'win32') {
      // Windows: Use PowerShell with a hidden window style
      const command = `powershell -Command "(New-Object Media.SoundPlayer '${soundFile}').PlaySync()"`;
      // For MP3s, we use this specific command which runs in the background
      const mp3Command = `powershell -WindowStyle Hidden -Command "Add-Type -AssemblyName PresentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open('${soundFile}'); $player.Play(); Start-Sleep -s 5"`;
      
      exec(mp3Command);
    } else {
      // Mac/Linux: These usually don't pop up windows anyway
      const player = require('play-sound')();
      player.play(soundFile, (err: any) => {
        if (err) console.error('Sound play failed:', err);
      });
    }
  }

  // CMD Trigger
  const disposable = vscode.commands.registerCommand('faaah.helloWorld', () => {
    vscode.window.showInformationMessage('Faaaaaah!');
    playSound();
  });
  context.subscriptions.push(disposable);

  // Watch for errors ONLY in the current file when typing/saving
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      // Small delay to let VS Code update diagnostics
      setTimeout(() => {
        const diagnostics = vscode.languages.getDiagnostics(event.document.uri);
        const hasError = diagnostics.some(
          (d) => d.severity === vscode.DiagnosticSeverity.Error
        );

        if (hasError) {
          playSound();
        }
      }, 500); 
    })
  );

  console.log('Faaaaaah fixed version activated!');
}

export function deactivate() {}