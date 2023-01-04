export class Node {
  x: number;
  y: number;
  visited: boolean;
  connectedTo: Node[];
  shortestDistance: number;
  eastPassage: boolean;
  southPassage: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.connectedTo = [];
    this.shortestDistance = Number.MAX_SAFE_INTEGER;
    this.eastPassage = false;
    this.southPassage = false;
  }

  getUnvisitedNode(nodes: Node[][]): Node | null {
    var unvisitedNodes: Node[] = [];

    if (this.x > 0 && !nodes[this.x - 1][this.y].visited) {
      unvisitedNodes.push(nodes[this.x - 1][this.y]);
    }

    if (this.x < nodes.length - 1 && !nodes[this.x + 1][this.y].visited) {
      unvisitedNodes.push(nodes[this.x + 1][this.y]);
    }

    if (this.y > 0 && !nodes[this.x][this.y - 1].visited) {
      unvisitedNodes.push(nodes[this.x][this.y - 1]);
    }

    if (
      this.y < nodes[this.x].length - 1 &&
      !nodes[this.x][this.y + 1].visited
    ) {
      unvisitedNodes.push(nodes[this.x][this.y + 1]);
    }

    if (unvisitedNodes.length == 0) {
      return null;
    }

    return unvisitedNodes[Math.floor(Math.random() * unvisitedNodes.length)];
  }

  connect(node: Node) {
    this.connectedTo.push(node);
    if (node.x - this.x >= 1) {
      this.eastPassage = true;
    } else if (node.y - this.y <= -1) {
      this.southPassage = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D, blockSize: number) {
    ctx.fillStyle = "black";

    if (!this.southPassage) {
      ctx.beginPath();
      ctx.moveTo(this.x * blockSize, this.y * blockSize);
      ctx.lineTo(this.x * blockSize + blockSize, this.y * blockSize);
      ctx.stroke();
      ctx.closePath();
    }

    if (!this.eastPassage) {
      ctx.beginPath();
      ctx.moveTo(this.x * blockSize + blockSize, this.y * blockSize);
      ctx.lineTo(
        this.x * blockSize + blockSize,
        this.y * blockSize + blockSize
      );
      ctx.stroke();
      ctx.closePath();
    }
  }
}
