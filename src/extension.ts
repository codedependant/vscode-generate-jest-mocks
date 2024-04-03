import * as vscode from "vscode";
import cp from "child_process";
import path from "path";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "generate-jest-mocks.generateJestMocks",
      async () => {
        const editor = vscode.window.activeTextEditor;

        if (typeof editor === "undefined") {
          vscode.window.showInformationMessage(`No editor is active`);

          return;
        }

        const filePath =
          path.dirname(editor.document.uri.fsPath) +
          "/" +
          path.basename(editor.document.uri.fsPath).replace(".test.js", ".ts");

        vscode.window.showInformationMessage(`generate mocks ${filePath}`);

        // run git status
        cp.exec(`generate-jest-mocks ${filePath}`, (error, stdout, stderr) => {
          if (error) {
            console.error("Error running git status: " + error.message);
            vscode.window.showErrorMessage(error.message);

            return;
          }

          const snippets = new vscode.SnippetString(`${stdout}$0`);

          editor.insertSnippet(snippets);
        });
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
