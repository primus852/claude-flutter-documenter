// claude-documenter — Typst manual template
// Pandoc passes document variables as: doc.title, doc.author, doc.date, doc.lang

#let doc = (
  title: "$title$",
  author: "$author$",
  date: "$date$",
  lang: "$lang$",
)

#set document(title: doc.title, author: doc.author)
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 3cm, right: 2.5cm),
  header: align(right, text(size: 9pt, fill: gray)[#doc.title]),
  footer: align(center, text(size: 9pt, fill: gray)[#counter(page).display("1")]),
)
#set text(
  font: "New Computer Modern",
  size: 11pt,
  lang: doc.lang,
  hyphenate: true,
)
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.1")

// Cover page
#align(center)[
  #v(4cm)
  #text(size: 28pt, weight: "bold")[#doc.title]
  #v(0.5cm)
  #text(size: 14pt, fill: gray)[#doc.date]
  #v(0.5cm)
  #text(size: 12pt)[#doc.author]
]
#pagebreak()

// Table of contents
$if(toc)$
#outline(depth: 2, indent: 1em)
#pagebreak()
$endif$

// Body
$body$
