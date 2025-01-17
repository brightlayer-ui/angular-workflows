import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BluiCommonComponentsModule } from '../auth-common.module';
import { BluiAuthErrorDialogComponent } from './error-dialog.component';

describe('BluiAuthErrorDialogComponent', () => {
    let component: BluiAuthErrorDialogComponent;
    let fixture: ComponentFixture<BluiAuthErrorDialogComponent>;

    beforeEach(() => {
        void TestBed.configureTestingModule({
            imports: [BluiCommonComponentsModule, RouterTestingModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BluiAuthErrorDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
