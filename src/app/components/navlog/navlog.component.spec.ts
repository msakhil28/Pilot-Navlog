import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavlogComponent } from './navlog.component';

describe('NavlogComponent', () => {
    let component: NavlogComponent;
    let fixture: ComponentFixture<NavlogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavlogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NavlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should start with 2 empty rows', () => {
        expect(component.navlogRows().length).toBe(2);
    });

    it('should add a row', () => {
        component.addRow();
        expect(component.navlogRows().length).toBe(3);
    });

    it('should remove a row', () => {
        const initialRows = component.navlogRows();
        const idToRemove = initialRows[0].id;
        component.removeRow(idToRemove);
        expect(component.navlogRows().length).toBe(1);
        expect(component.navlogRows()[0].id).not.toBe(idToRemove);
    });

    it('should calculate row WCA, GS, TH, ETE, Fuel', () => {
        // Setup a row
        const rowId = component.navlogRows()[0].id;
        component.navlogRows.update(rows => {
            const r = rows[0];
            r.course = 90;
            r.windDir = 360;
            r.windVel = 20;
            r.tas = 100;
            r.distance = 100;
            r.gph = 10;
            return [...rows];
        });

        component.calculateRow(rowId);
        fixture.detectChanges();

        const row = component.navlogRows()[0];

        // Wind from left (360) while flying East (90) -> Left Crosswind -> WCA should be negative (-ve) or positive?
        // Wind angle = 360 - 90 = 270 (rad: 4.71)
        // sinWCA = (20/100) * sin(270) = 0.2 * -1 = -0.2
        // arcsin(-0.2) approx -11.5 deg.
        // WCA should be around -12
        expect(row.wca).toBe(-12);

        // GS = 100*cos(-11.5) + 20*cos(270) = 100*0.98 + 0 = 98. 
        expect(row.gs).toBe(98);

        // TH = 90 + (-12) = 78
        expect(row.th).toBe(78);

        // ETE = (100 / 98) * 60 = 1.02 * 60 = 61.2 mins -> 61
        expect(row.ete).toBe(61);

        // Fuel = (61/60) * 10 = 10.16 -> 10.2
        expect(row.fuel).toBe(10.2);
    });

    it('should handle magnetic variation', () => {
        const rowId = component.navlogRows()[0].id;
        component.navlogRows.update(rows => {
            const r = rows[0];
            r.course = 90;
            r.windDir = 90; // Headwind
            r.windVel = 0;
            r.tas = 100;
            r.variation = '-5'; // West variation match logic
            return [...rows];
        });

        component.calculateRow(rowId);
        const row = component.navlogRows()[0];

        // TH = 90
        // Variation -5. Code says: if negative, subtract.
        // MH = 90 - 5 = 85.
        expect(row.mh).toBe(85);
    });
});
