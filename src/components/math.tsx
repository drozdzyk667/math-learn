import katex from "katex";

type MathProps = {
  tex: string;
  display?: boolean;
  className?: string;
};

export function MathFormula({ tex, display = false, className = "" }: MathProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: "ignore",
    output: "html",
  });

  return (
    <span
      className={`math-formula ${display ? "math-display" : "math-inline"} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
