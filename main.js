import { parse, HtmlGenerator } from "/dist/latex.mjs";

let latexCode = `
\\documentclass{article}
\\begin{document}
First document. This is a simple example, with no 
extra parameters or packages included.
\\end{document}
`;

const iframeElement = document.getElementById("pdf-preview");

/**
 * generates HTML code given a LaTeX code
 * @param {string} latexCode
 */
function generateHtmlFromLatex(latexCode) {
  let generator = parse(latexCode, {
    generator: new HtmlGenerator({ hyphenate: false }),
  });
  const html = generator.htmlDocument().documentElement.innerHTML;
  const index = html.indexOf("</head>") + 7;
  const body = html.slice(index);
  //   console.log(body);

  // console.log(generator.htmlDocument().documentElement.outerHTML);
  const url = new URL("latex.js/", window.location.href);
  //   console.log(url.href);
  const headStylesAndScripts = generator.stylesAndScripts(url.href);
  //   console.log(headStylesAndScripts);

  if (iframeElement instanceof HTMLIFrameElement) {
    iframeElement.contentDocument.head.innerHTML = "";
    iframeElement.contentDocument.head.append(headStylesAndScripts);
    iframeElement.contentDocument.body.outerHTML = body;
    // console.log(iframeElement);
  }
}

let printable = false;

const latexTextArea = document.getElementById("latex-textarea");
const compileButton = document.getElementById("compile-button");
if (compileButton instanceof HTMLButtonElement) {
  compileButton.addEventListener("click", function () {
    if (latexTextArea instanceof HTMLTextAreaElement) {
      printable = false;
      const latexCode = latexTextArea.value;
      if (latexCode) {
        generateHtmlFromLatex(latexCode);
        printable = true;
      } else {
        console.error("Textarea is empty.");
      }
    }
  });
}

const printPdfButton = document.getElementById("print-pdf-button");
if (printPdfButton instanceof HTMLButtonElement) {
  printPdfButton.addEventListener("click", function () {
    if (iframeElement instanceof HTMLIFrameElement) {
      if (printable) {
        iframeElement.contentWindow.print();
      }
    }
  });
}
