import * as vscode from "vscode";
const util = require("node:util");

import cp from "child_process";
import path from "path";
import fs from "fs";

const exec = util.promisify(cp.exec);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "generate-jest-mocks.generateJestMocks",
      async () => {
        try {
          const editor = vscode.window.activeTextEditor;

          if (typeof editor === "undefined") {
            vscode.window.showInformationMessage(`No editor is active`);

            return;
          }

          const testFilePath = editor.document.uri.fsPath;

          const srcFilePath = [".js", ".ts", ".tsx", ".jsx"].reduce(
            (memo, ext) => {
              const tmpFilePath = `${path.dirname(testFilePath)}/${path
                .basename(testFilePath)
                .replace(/\.test\.(?=[^.]+$).*/, ext)}`;

              if (fs.existsSync(tmpFilePath)) {
                return tmpFilePath;
              }

              return memo;
            }
          );

          const output = await exec(`generate-jest-mocks ${srcFilePath}`);

          if (output.stderr) {
            throw new Error(output.stderr);
          }

          const snippets = new vscode.SnippetString(`${output.stdout}$0`);

          editor.insertSnippet(snippets);
        } catch (error: any) {
          console.error(error);
          vscode.window.showErrorMessage(error.message);
        }
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
