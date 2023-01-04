import { Node } from "./Node";

export default class RecursiveBacktrackingMazeGenerator {
  horizontalNodeCount: number;
  verticalNodeCount: number;
  nodes: Node[][];
  queue: Node[];
  running: boolean;
  constructor(horizontalNodeCount: number, verticalNodeCount: number) {
    this.horizontalNodeCount = horizontalNodeCount;
    this.verticalNodeCount = verticalNodeCount;
    this.nodes = [];

    for (var x = 0; x < this.horizontalNodeCount; x++) {
      this.nodes[x] = [];
      for (var y = 0; y < this.verticalNodeCount; y++) {
        this.nodes[x][y] = new Node(x, y);
      }
    }

    this.queue = [this.nodes[0][0]];
    this.running = true;
  }

  update() {
    if (this.queue.length == 0) {
      this.running = false;
      return;
    }

    var currentNode = this.queue.shift()!;
    let chosen = currentNode.getUnvisitedNode(this.nodes);

    if (chosen == null) {
      return;
    }

    this.queue.push(currentNode);
    currentNode.connect(chosen);
    chosen.connect(currentNode);
    chosen.visited = true;
    this.queue.unshift(chosen);
  }

  draw(ctx: CanvasRenderingContext2D, blockSize: number) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    for (var x = 0; x < this.horizontalNodeCount; x++) {
      for (var y = 0; y < this.verticalNodeCount; y++) {
        this.nodes[x][y].draw(ctx, blockSize);
      }
    }
  }
}
