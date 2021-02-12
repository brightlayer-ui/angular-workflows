import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PxbAuthConfig } from './../../../../services/config/auth-config';
import { PxbRegisterUIService } from '../../../../services/api/register-ui.service';
import { PxbAuthSecurityService, SecurityContext } from '../../../../services/state/auth-security.service';
import * as Colors from '@pxblue/colors';

@Component({
    selector: 'pxb-create-account-eula-step',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="mat-title pxb-auth-title">License Agreement</div>
        <div
            #eulaVC
            *ngIf="eula"
            class="pxb-auth-full-height"
            style="overflow: auto"
            (scroll)="checkScrollDistance($event)"
            [innerHTML]="sanitizer.sanitize(1, eula)"
        ></div>
        <pxb-empty-state
            *ngIf="!eula && !isLoading"
            class="pxb-auth-full-height"
            title="Error"
            description="License Agreement Failed To Load"
        >
            <mat-icon pxb-empty-icon [style.color]="colors.red[500]">error</mat-icon>
            <button pxb-actions mat-raised-button color="primary" (click)="getEULA()">
                <mat-icon>replay</mat-icon>
                Reload
            </button>
        </pxb-empty-state>
        <div *ngIf="eula" class="pxb-eula-confirm-agreement">
            <mat-checkbox
                class="pxb-eula-checkbox"
                [disabled]="!userScrolledBottom"
                [(ngModel)]="userAcceptsEula"
                (change)="userAcceptsEulaChange.emit(userAcceptsEula)"
                ngDefaultControl
            >
                I have read and agree to the Terms & Conditions
            </mat-checkbox>
        </div>
    `,
    styles: [
        `
            .pxb-eula-confirm-agreement {
                margin: 24px 0;
            }
            ::ng-deep .pxb-eula-checkbox .mat-checkbox-inner-container {
                width: 18px;
                height: 18px;
            }
            ::ng-deep .pxb-empty-state-description {
                color: #424e54 !important;
            }
        `,
    ],
})
export class PxbEulaComponent {
    @Input() userAcceptsEula: boolean;
    @Output() userAcceptsEulaChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('eulaVC') eulaVC: ElementRef;

    eula: string;
    isLoading: boolean;
    userScrolledBottom = false;
    colors = Colors;

    constructor(
        public sanitizer: DomSanitizer,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _pxbAuthConfig: PxbAuthConfig,
        private readonly _pxbRegisterService: PxbRegisterUIService,
        private readonly _pxbSecurityService: PxbAuthSecurityService
    ) {
        this._pxbSecurityService.securityStateChanges().subscribe((state: SecurityContext) => {
            this.isLoading = state.isLoading;
        });
    }

    ngOnInit(): void {
        // Configurable option to require users to scroll to bottom of EULA before accepting.
        if (!this._pxbAuthConfig.eulaScrollLock) {
            this.userScrolledBottom = true;
        }
        // User has already scrolled to the bottom and accepted the EULA.
        if (this.userAcceptsEula) {
            this.userScrolledBottom = true;
        }
        this.getEULA();
    }

    getEULA(): void {
        if (this._pxbAuthConfig.eula) {
            this.afterGetEula(this._pxbAuthConfig.eula);
        } else {
            this._pxbSecurityService.setLoading(true);
            this._pxbRegisterService
                .loadEULA()
                .then((eula: string) => {
                    this.afterGetEula(eula);
                })
                .catch(() => {
                    this._pxbSecurityService.setLoading(false);
                });
        }
    }

    afterGetEula(eula: string): void {
        this.eula = eula;
        this._pxbSecurityService.setLoading(false);
        this._changeDetectorRef.detectChanges();
        if (!this.userAcceptsEula) {
            const el = this.eulaVC.nativeElement;
            const isEulaScrollable = el.scrollHeight > el.clientHeight;
            this.userScrolledBottom = !isEulaScrollable;
        }
    }

    checkScrollDistance(e: Event): void {
        if (this.userScrolledBottom) {
            return;
        }
        const el = e.target as HTMLElement;
        this.userScrolledBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;
    }
}
