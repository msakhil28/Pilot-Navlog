
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface NavlogEntry {
  id: number;
  waypoint: string;
  vorIdent: string;
  vorFreq: number | null;
  course: number | null;
  windDir: number | null;
  windVel: number | null;
  tas: number | null;
  altitude: number | null;
  tc: number | null;
  wca: number | null;
  th: number | null;
  variation: number | null;
  mh: number | null;
  distance: number | null;
  gs: number | null;
  ete: number | null;
  gph: number | null;
  fuel: number | null;
}

@Component({
    selector: 'app-navlog',
    imports: [FormsModule],
    templateUrl: './navlog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavlogComponent {
  navlogRows = signal<NavlogEntry[]>([this.createEmptyRow(), this.createEmptyRow()]);

  private createEmptyRow(): NavlogEntry {
    return {
      id: Date.now() + Math.random(),
      waypoint: '',
      vorIdent: '',
      vorFreq: null,
      course: null,
      windDir: null,
      windVel: null,
      tas: null,
      altitude: null,
      tc: null,
      wca: null,
      th: null,
      variation: null,
      mh: null,
      distance: null,
      gs: null,
      ete: null,
      gph: null,
      fuel: null
    };
  }

  addRow(): void {
    this.navlogRows.update(rows => [...rows, this.createEmptyRow()]);
  }

  removeRow(idToRemove: number): void {
    this.navlogRows.update(rows => rows.filter(row => row.id !== idToRemove));
  }

  trackById(index: number, item: NavlogEntry): number {
    return item.id;
  }
  
  totalDistance = computed(() => this.navlogRows().reduce((acc, row) => acc + (row.distance || 0), 0));
  totalEte = computed(() => this.navlogRows().reduce((acc, row) => acc + (row.ete || 0), 0));
  totalFuel = computed(() => this.navlogRows().reduce((acc, row) => acc + (row.fuel || 0), 0));

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  calculateRow(rowId: number): void {
    this.navlogRows.update(rows => {
      const rowIndex = rows.findIndex(r => r.id === rowId);
      if (rowIndex === -1) return rows;

      const originalRow = rows[rowIndex];
      const newRow = { ...originalRow };

      const { course, windDir, windVel, tas, variation, distance, gph } = newRow;

      // TC is just the course
      newRow.tc = course;

      // Main Calculations: WCA, GS, TH
      if (course === null || windDir === null || windVel === null || tas === null || tas <= 0) {
        newRow.wca = null;
        newRow.gs = null;
        newRow.th = null;
      } else {
        const windAngleRad = this.degreesToRadians(windDir - course);
        const sinWca = (windVel / tas) * Math.sin(windAngleRad);

        if (sinWca >= 1 || sinWca <= -1) { // Impossible correction
          newRow.wca = null;
          newRow.gs = null;
          newRow.th = null;
        } else {
          const wcaRad = Math.asin(sinWca);
          const wca = this.radiansToDegrees(wcaRad);
          newRow.wca = Math.round(wca);

          const gs = tas * Math.cos(wcaRad) + windVel * Math.cos(windAngleRad);
          newRow.gs = Math.round(gs);

          let th = course + wca;
          th = (th % 360 + 360) % 360; // Keep in 0-359 range
          newRow.th = Math.round(th);
        }
      }
      
      // Magnetic Heading
      if (newRow.th !== null && variation !== null) {
        let mh = newRow.th - variation;
        mh = (mh % 360 + 360) % 360; // Keep in 0-359 range
        newRow.mh = Math.round(mh);
      } else {
        newRow.mh = null;
      }
      
      // ETE
      if (distance !== null && newRow.gs !== null && newRow.gs > 0) {
        const eteMinutes = (distance / newRow.gs) * 60;
        newRow.ete = Math.round(eteMinutes);
      } else {
        newRow.ete = null;
      }
      
      // Fuel
      if (newRow.ete !== null && gph !== null) {
        const fuelGallons = (newRow.ete / 60) * gph;
        newRow.fuel = Number(fuelGallons.toFixed(1));
      } else {
        newRow.fuel = null;
      }

      const newRows = [...rows];
      newRows[rowIndex] = newRow;
      return newRows;
    });
  }
}