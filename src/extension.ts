import * as vscode from 'vscode';
import * as path from 'path';
import player from 'play-sound';

export function activate(context: vscode.ExtensionContext) {

    const soundPlayer = player();
    let lastPlay = 0;
    const cooldown = 3000; 

    function playSound() {
        if (Date.now() - lastPlay < cooldown) return;
        lastPlay = Date.now();

        const soundFile = path.join(context.extensionPath, 'media', 'faaaaah.mp3');
        soundPlayer.play(soundFile, (err) => {
            if (err) console.error('Sound play failed:', err);
        });
    }

    // CMD Trigger
    const disposable = vscode.commands.registerCommand('faaah.helloWorld', () => {
        vscode.window.showInformationMessage('Faaaaaah!');
        playSound();
    });
    context.subscriptions.push(disposable);


    vscode.tasks.onDidEndTaskProcess((e) => {
        if (e.exitCode !== 0) {
            playSound();
        }
    });

   
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => {
            const diagnostics = vscode.languages.getDiagnostics();
            let errorFound = false;

            for (const [uri, diags] of diagnostics) {
                if (diags.some(d => d.severity === vscode.DiagnosticSeverity.Error)) {
                    errorFound = true;
                    break;
                }
            }

            if (errorFound) {
                playSound();
            }
        })
    );

    console.log('Faaaaaah full multi-language watcher activated!');
}

export function deactivate() {}