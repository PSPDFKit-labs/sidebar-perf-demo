import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput", { static: false })
  fileInputRef!: ElementRef<HTMLInputElement>;

  documentPath: string | null = null;
  private NutrientViewer: any;
  private instance: any;

  async ngOnInit() {
    try {
      this.NutrientViewer = await import("@nutrient-sdk/viewer");

      if (!this.NutrientViewer) {
        console.error("NutrientViewer is undefined after import!");
        return;
      }

      // Preload worker for better performance
      this.NutrientViewer.preloadWorker({
        baseUrl: `${window.location.origin}/`,
        processorEngine: this.NutrientViewer.ProcessorEngine.fasterProcessing,
      });
    } catch (error) {
      console.error("Error loading Nutrient SDK:", error);
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.NutrientViewer?.unload("#pspdfkit-container");
    }
  }

  async handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Revoke the previous object URL to free memory
      if (this.documentPath) {
        URL.revokeObjectURL(this.documentPath);
      }

      this.documentPath = URL.createObjectURL(file);

      // Unload previous instance if exists
      if (this.instance) {
        await this.NutrientViewer.unload("#pspdfkit-container");
      }

      // Load new document
      try {
        this.instance = await this.NutrientViewer.load({
          container: "#pspdfkit-container",
          baseUrl: `${window.location.origin}/`,
          document: this.documentPath,
        });
      } catch (error) {
        console.error("Error loading document:", error);
      }
    }
  }

  handleButtonClick() {
    this.fileInputRef?.nativeElement.click();
  }
}
