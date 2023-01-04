import { Node } from "./Node";

export class MazeSolver {
  horizontalNodeCount: number;
  verticalNodeCount: number;
  nodes: Node[][];
  path: Node[];
  start: Node;
  end: Node;
  visitedNodes: Set<Node>;
  nextNodes: Node[];
  running: boolean;
  isSetup: boolean;
  currentNode: Node;
  destX: number;
  destY: number;

  constructor(
    nodes: Node[][],
    horizontalNodeCount: number,
    verticalNodeCount: number
  ) {
    this.horizontalNodeCount = horizontalNodeCount;
    this.verticalNodeCount = verticalNodeCount;
    this.nodes = nodes;

    this.visitedNodes = new Set<Node>();
    this.nextNodes = [];
    this.path = [];
    this.destX = this.horizontalNodeCount - 1;
    this.destY = this.verticalNodeCount - 1;
    this.start = this.nodes[0][0];
    this.end = this.nodes[this.destX][this.destY];
    this.running = false;
    this.isSetup = false;
    this.currentNode = this.end;
  }

  handleClick(x: number, y: number) {
    this.destX = Math.min(x, this.horizontalNodeCount - 1);
    this.destY = Math.min(y, this.verticalNodeCount - 1);
    this.setup();
  }

  setup() {
    for (var x = 0; x < this.horizontalNodeCount; x++) {
      for (var y = 0; y < this.verticalNodeCount; y++) {
        this.nodes[x][y].visited = false;
        this.nodes[x][y].shortestDistance = Number.MAX_SAFE_INTEGER;
      }
    }

    this.visitedNodes = new Set<Node>();
    this.nextNodes = [];
    this.path = [];
    this.start = this.nodes[1][1];
    this.start.shortestDistance = 0;
    this.currentNode = this.end = this.nodes[this.destX][this.destY];
    this.visit(this.start);
    this.isSetup = true;
    this.running = true;
  }

  update() {
    if (this.end.visited || this.nextNodes.length == 0) {
      this.findShortestPath();
      return;
    }

    var closestNeighbour = this.nextNodes.pop();
    closestNeighbour!.visited = true;
    this.visit(closestNeighbour!);
    this.nextNodes = this.nextNodes.sort(
      (a, b) => a.shortestDistance - b.shortestDistance
    );
  }

  findShortestPath() {
    if (this.currentNode == this.start) {
      this.running = false;
      return;
    }

    this.path.push(this.currentNode);
    this.currentNode = this.currentNode.connectedTo.sort(
      (a, b) => a.shortestDistance - b.shortestDistance
    )[0];
  }

  visit(node: Node) {
    this.visitedNodes.add(node);

    for (var i = 0; i < node.connectedTo.length; i++) {
      var neighbour = node.connectedTo[i];

      if (neighbour.visited) {
        continue;
      }

      if (node.shortestDistance + 1 < neighbour.shortestDistance) {
        neighbour.shortestDistance = node.shortestDistance + 1;
        this.nextNodes.push(neighbour);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (var x = 0; x < this.horizontalNodeCount; x++) {
      for (var y = 0; y < this.verticalNodeCount; y++) {
        if (this.nodes[x][y].shortestDistance == Number.MAX_SAFE_INTEGER) {
          continue;
        }
        ctx.fillStyle = this.calcColor(this.nodes[x][y].shortestDistance);
        ctx.fillRect(x * 10, y * 10, 10, 10);
      }
    }

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.end.x * 10 + 5, this.end.y * 10 + 5);

    for (var x = 0; x < this.path.length; x++) {
      ctx.lineTo(this.path[x].x * 10 + 5, this.path[x].y * 10 + 5);
    }

    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(
      this.start.x * 10 + 5,
      this.start.y * 10 + 5,
      3,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.end.x * 10 + 5, this.end.y * 10 + 5, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();
  }

  calcColor(val: number): string {
    var minHue = 240,
      maxHue = 0;
    var curPercent = val / 200;
    var colString =
      "hsl(" + (curPercent * (maxHue - minHue) + minHue) + ",100%,50%)";
    return colString;
  }
}
