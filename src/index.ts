import RecursiveBacktracking from "./RecursiveBacktrackingMazeGenerator";
import { MazeSolver } from "./MazeSolver";

export default class Mazes {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mazes: RecursiveBacktracking;
  mazeSolver: MazeSolver;

  constructor() {
    this.canvas = document.getElementById("mazes-canvas") as HTMLCanvasElement;

    if (this.canvas == null) {
      throw new Error("Could not find canvas.");
    }

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = 500;
    this.canvas.height = 500;

    this.mazes = new RecursiveBacktracking(50, 45);
    this.mazeSolver = new MazeSolver(
      this.mazes.nodes,
      this.mazes.horizontalNodeCount,
      this.mazes.verticalNodeCount
    );

    this.canvas.addEventListener("click", (e: MouseEvent) => {
      if (this.mazes.running) {
        return;
      }

      let rect = this.canvas.getBoundingClientRect();
      var x = Math.round((e.clientX - rect.left) / 10);
      var y = Math.round((e.clientY - rect.top) / 10);
      this.mazeSolver.handleClick(x, y);
    });
  }

  Start() {
    this.animate(0);
  }

  animate(timestamp: number) {
    if (this.mazes.running) {
      for (var i = 0; i < 5; i++) {
        this.mazes.update();
      }
    } else {
      if (!this.mazeSolver.isSetup) {
        this.mazeSolver.setup();
      }

      this.mazeSolver.update();
    }

    this.draw();

    requestAnimationFrame((n) => this.animate(n));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mazeSolver.draw(this.ctx);
    this.mazes.draw(this.ctx, 10);

    this.ctx.font = "20px pixel";
    this.ctx.fillStyle = "black";
    this.ctx.textBaseline = "top";
    if (this.mazes.running) {
      this.ctx.fillText(
        "> Recursive Backtracking",
        20,
        this.canvas.height - 30
      );
    } else if (this.mazeSolver.running) {
      this.ctx.fillText("> Dijkstra's algorithm", 20, this.canvas.height - 30);
    } else {
      this.ctx.fillText(
        "> Click to move destination",
        20,
        this.canvas.height - 30
      );
    }
  }
}
