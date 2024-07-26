import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import interact from 'interactjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OrganizationChartModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  selectedNodes!: TreeNode[];
  data: TreeNode[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('orgChart') orgChart!: ElementRef;

  constructor(private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<TreeNode[]>('assets/data2.json').subscribe((data) => {
      this.data = data;
    });
  }

  // PERMITE CONTROLAR COMO SI FUERA UN MÓVIL A LA PANTALLA
  ngAfterViewInit() {
    const container = this.scrollContainer.nativeElement;

    // Permitir movimiento tipo móvil
    interact(container).draggable({
      listeners: {
        start(event) {
          container.style.cursor = 'grabbing';
        },
        move(event) {
          const { dx, dy } = event;
          container.scrollLeft -= dx;
          container.scrollTop -= dy;
        },
        end(event) {
          container.style.cursor = 'grab';
        }
      }
    }).styleCursor(false);

      // Centralizar el líder
      setTimeout(() => {
        // Busca el nodo del líder basado en el id
        const leaderNode = container.querySelector('[data-node-id="leader-id"]');
        if (leaderNode) {
          leaderNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 0);
  }

}
