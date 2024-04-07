import * as vscode from "vscode";
const util = require("node:util");

import cp from "child_process";
import path from "path";
import fs from "fs";

import generateJestMocks from "generate-jest-mocks";

const exec = util.promisify(cp.exec);

async function generate({ automock }: { automock?: boolean } = {}) {
  try {
    const editor = vscode.window.activeTextEditor;

    if (typeof editor === "undefined") {
      vscode.window.showInformationMessage(`No editor is active`);

      return;
    }

    const testFilePath = editor.document.uri.fsPath;

    const srcFilePath = [".js", ".ts", ".tsx", ".jsx"].reduce((memo, ext) => {
      const tmpFilePath = `${path.dirname(testFilePath)}/${path
        .basename(testFilePath)
        .replace(/\.test\.(?=[^.]+$).*/, ext)}`;

      if (fs.existsSync(tmpFilePath)) {
        return tmpFilePath;
      }

      return memo;
    });

    const file = await vscode.workspace.openTextDocument(srcFilePath);
    console.log("generate : file.getText():", file.getText());
    const output = generateJestMocks(file.getText(), { automock });

    const snippets = new vscode.SnippetString(`${output}$0`);

    editor.insertSnippet(snippets);
  } catch (error: any) {
    console.error(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "generate-jest-mocks.generateJestMocks",
      async () => generate()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "generate-jest-mocks.generateJestAutoMocks",
      async () => generate({ automock: true })
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
