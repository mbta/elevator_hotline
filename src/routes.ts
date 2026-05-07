export type Line = "red" | "orange" | "green" | "blue" | "silver" | "commuter";
type RouteId = string;

function config(item: string) {
  return process.env[item]!;
}

function getLine(line: string, line_id: Line) {
  return config(line)
    .split(",")
    .map((item) => {
      return { line: item.trim(), id: line_id };
    });
}
const routeIds = [
  getLine("LINE_RED", "red"),
  getLine("LINE_ORANGE", "orange"),
  getLine("LINE_GREEN", "green"),
  getLine("LINE_BLUE", "blue"),
  getLine("LINE_SILVER", "silver"),
  getLine("LINE_COMMUTER", "commuter"),
].reduce((acc, val) => [...acc, ...val], []);

export const routesToLine = routeIds.reduce(
  (acc: Record<RouteId, Line>, route) => {
    acc[route.line] = route.id;
    return acc;
  },
  {} as Record<RouteId, Line>
);
