const names = [
  undefined,
  ["premier", "premiere"],
  ["deuxieme", "deuxieme"],
  ["troisieme", "troisieme"],
  ["quatrieme", "quatrieme"],
  ["cinquieme", "cinquieme"],
  ["sixieme", "sixieme"],
  ["septieme", "septieme"],
  ["huitieme", "huitieme"],
  ["neuvieme", "neuvieme"],
  ["dixieme", "dixieme"],
]

export function getNthName(n: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
                           gender: "masc" | "fem" = "masc") {
  return names[n]![{
    masc: 0,
    fem: 1
  }[gender]];
}
